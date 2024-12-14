// This file can be deleted as we're using the Web Speech API instead

import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Get Python path from environment or use default Windows path
const PYTHON_PATH = 'C:\\Users\\hypen\\AppData\\Local\\Programs\\Python\\Python311\\python.exe';

export async function POST(req: Request) {
  try {
    const { text, voice } = await req.json();
    
    // Generate a unique filename
    const outputFileName = `output-${Date.now()}.wav`;
    const outputPath = path.join(process.cwd(), 'public', 'audio', outputFileName);
    
    // Ensure the audio directory exists
    const audioDir = path.join(process.cwd(), 'public', 'audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    // Select the appropriate model based on voice type
    let model = '';
    switch (voice) {
      case 'male':
        model = 'tts_models/en/ljspeech/tacotron2-DDC';
        break;
      case 'female':
        model = 'tts_models/en/ljspeech/glow-tts';
        break;
      case 'robot':
        model = 'tts_models/en/vctk/fast_pitch';
        break;
      default:
        model = 'tts_models/en/ljspeech/tacotron2-DDC';
    }

    // Construct and execute TTS command
    const pythonScript = `
import sys
from TTS.api import TTS

try:
    tts = TTS(model_name="${model}", progress_bar=False)
    tts.tts_to_file(text="${text.replace('"', '\\"')}", file_path="${outputPath.replace(/\\/g, '/')}")
    print("success")
except Exception as e:
    print(f"error: {str(e)}")
    sys.exit(1)
`.trim();

    const tempScriptPath = path.join(process.cwd(), 'temp_tts_script.py');
    fs.writeFileSync(tempScriptPath, pythonScript);

    try {
      await execAsync(`${PYTHON_PATH} ${tempScriptPath}`);
      fs.unlinkSync(tempScriptPath); // Clean up temp script
      
      return NextResponse.json({ 
        success: true, 
        audioUrl: `/audio/${outputFileName}` 
      });
    } catch (error) {
      fs.unlinkSync(tempScriptPath); // Clean up temp script even if there's an error
      throw error;
    }

  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate speech' 
    }, { status: 500 });
  }
}
