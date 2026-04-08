# 🚀 Vibe Coder

**Vibe Coder** is an autonomous AI agent designed to build, fix, and run React applications from simple natural language prompts. It leverages the power of Gemini (via function calling) to act as a pair programmer that doesn't just write code, but also ensures the application actually builds and runs.

## ✨ Features

- **Autonomous Scaffolding**: Automatically sets up a modern Vite + React + TypeScript base.
- **Agentic Coding**: Uses a tool-calling loop with the **[@google/genai SDK](https://www.npmjs.com/package/@google/genai)** to write components, styles, and logic.
- **Self-Healing Build System**: If the application fails to build, Vibe Coder captures the compiler errors and asks the AI to fix them—retrying up to 5 times.
- **Automated Preview**: Once the build is successful, it automatically launches the app in preview mode.

## 📁 Project Structure

- `src/flows/`: Core logic for different stages of the lifecycle.
  - `scaffoldApp.ts`: Initializes the output directory.
  - `createApp.ts`: The main AI agentic loop for writing code.
  - `buildApp.ts`: Handles the build process and automated bug fixing.
  - `startApp.ts`: Runs the final production-ready preview.
- `src/prompts/`: Structured templates for system instructions and build-error context.
- `src/tools/`: The set of tools the AI can use (filesystem operations, etc.).
- `output/`: The directory where your generated React app lives.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js installed.
- A Gemini API key. Create a `.env` file in the root directory and add your key:
  ```env
  GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
  ```

### 2. Installation
```bash
npm install
```

### 3. Usage
Run the main script with your request:
```bash
npx tsx src/index.ts "build me a beautiful glassmorphic multi-step signup form"
```

## 🛠️ How it Works

1. **Scaffold**: A clean Vite template is copied into the `output/` folder.
2. **Create**: The AI agent analyzes the prompt and begins calling tools to create files.
3. **Build**: The system runs `npm run build`. 
4. **Fix**: If the build fails, the agent reads the error logs, looks at the code, and applies fixes.
5. **Preview**: Once error-free, the app is served via `npm run preview`.

## 📝 License
MIT
