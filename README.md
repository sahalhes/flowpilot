# FlowPilot

FlowPilot is an AI-driven automation platform that enables users to integrate and control Pica connections and custom agents seamlessly. It supports ElevenLabs voice agents and works with Pica and Lovable to provide intelligent automation solutions.

## Features
- **Custom AI Agents**: Use Pica or integrate your own AI agents.
- **Voice Interaction**: ElevenLabs-powered voice responses.
- **Automated Error Resolution**: AI-driven troubleshooting.
- **n8n Integration**: Process data and automate workflows.
- **Web Parsing & Summarization**: Extract, summarize, and analyze web content.
- **Fal.ai Image Generation**: Create AI-generated images and store them in Google Drive.
- **Stripe Integration**: Automate server creation upon payment.

## Installation
### Prerequisites
- Node.js (v16+ recommended)
- Workflow automation platform
- PostgreSQL (for memory storage)
- API keys for ElevenLabs, Pica, Fal.ai, and Stripe

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/sahalhes/flowpilot.git
   cd flowpilot
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   ```sh
   cp .env.example .env
   ```
   Fill in the necessary API keys in the `.env` file.
4. Start the server:
   ```sh
   npm start
   ```

## Usage
- **AI Chatbot**: Interact with the AI through the web UI.
- **URL Helper**: Send URLs for summarization, memory tricks, or quizzes.
- **Image Generation**: Request AI-generated images via Fal.ai.
- **Automation**: Utilize n8n workflows for advanced automation.

## Contribution
1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
3. Commit your changes:
   ```sh
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```sh
   git push origin feature-branch
   ```
5. Open a Pull Request.

## License
This project is licensed under the MIT License.
