'use client';

import { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Slider } from "../components/ui/slider";
import { useToast } from "../components/ui/use-toast";

export default function Home() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleVoiceChange = (value: string) => {
    setVoice(value);
  };

  const getEstimatedDuration = () => {
    // Rough estimation: average speaking rate is about 150 words per minute
    const wordCount = text.trim().split(/\s+/).length;
    const duration = (wordCount / 150) * (1 / rate) * 60; // in seconds
    return duration.toFixed(1);
  };

  const handleSpeak = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const selectedVoice = voices.find(v => v.name === voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.pitch = pitch;
        utterance.rate = rate;

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = (event) => {
          setSpeaking(false);
          toast({
            title: "Error",
            description: "Failed to generate speech. Please try again.",
            variant: "destructive"
          });
        };

        window.speechSynthesis.speak(utterance);
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const selectedVoice = voices.find(v => v.name === voice);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Voiceover Generator</h1>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Text to Speak:</Label>
            <Textarea 
              id="text" 
              value={text} 
              onChange={handleTextChange}
              placeholder="Enter the text you want to convert to speech..."
              className="min-h-[120px]"
              disabled={speaking}
            />
            <div className="text-sm text-gray-500">
              Characters: {text.length} | Estimated duration: {getEstimatedDuration()}s
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="voice">Voice:</Label>
            <Select value={voice} onValueChange={handleVoiceChange} disabled={speaking}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((v) => (
                  <SelectItem key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedVoice && (
              <div className="text-sm text-gray-500">
                Language: {selectedVoice.lang} | Name: {selectedVoice.name}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Pitch ({pitch.toFixed(1)})</Label>
              <Slider
                value={[pitch]}
                onValueChange={(value) => setPitch(value[0])}
                min={0.5}
                max={2}
                step={0.1}
                disabled={speaking}
              />
            </div>

            <div className="space-y-2">
              <Label>Rate ({rate.toFixed(1)}x)</Label>
              <Slider
                value={[rate]}
                onValueChange={(value) => setRate(value[0])}
                min={0.5}
                max={2}
                step={0.1}
                disabled={speaking}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSpeak} 
              className="flex-1"
              disabled={!text.trim() || speaking || voices.length === 0}
            >
              {speaking ? 'Speaking...' : 'Speak'}
            </Button>
            {speaking && (
              <Button 
                onClick={handleStop} 
                variant="destructive"
              >
                Stop
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
