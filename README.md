# AI Voiceover Generator

A modern web-based voiceover generator that leverages various AI models and APIs for high-quality text-to-speech conversion.

## Features

- Text-to-speech conversion using Web Speech API
- Multiple voice options from your system
- Voice customization:
  - Adjustable pitch
  - Adjustable speech rate
- Real-time audio generation
- Modern, responsive UI
- Built with Next.js and TypeScript
- Error handling with toast notifications

## Prerequisites

1. Node.js 18 or later from [nodejs.org](https://nodejs.org/)
2. A modern web browser (Chrome or Edge recommended for best voice selection)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/606ai/voiceover-generator.git
cd voiceover-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your API keys:
```bash
cp .env.example .env
# Edit .env with your actual API keys
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to use the application.

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui Components
- Web Speech API
- Various AI APIs:
  - Groq
  - HuggingFace
  - Anthropic
  - OpenRouter

## Project Structure

- `/app` - Next.js app directory containing pages and API routes
- `/components` - Reusable UI components
- `/lib` - Utility functions and API integrations

## How It Works

1. The application uses the Web Speech API for basic text-to-speech functionality
2. When you enter text and select a voice:
   - The text is processed using the selected voice
   - Voice parameters (pitch and rate) are applied
   - Audio is generated and played in real-time
3. Advanced AI features (coming soon):
   - Enhanced voice models via AI APIs
   - Custom voice generation
   - Voice cloning capabilities

## Security

- API keys are stored securely in environment variables
- Keys are never exposed to the client-side
- All API requests are made server-side

## Contributing

Feel free to submit issues and enhancement requests! Follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
