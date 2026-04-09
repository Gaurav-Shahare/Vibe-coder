# 🚀 Vibe Coder

**Vibe Coder** is an autonomous AI agent designed to build, fix, and run applications from simple natural language prompts. It leverages the power of Gemini (via function calling) to act as a pair programmer that doesn't just write code, but also ensures the application actually builds and runs.

## ✨ Features

- **Multi-Framework Support**: Automatically scaffolds and builds apps in **React** (via Vite) or **Angular** (via Angular CLI).
- **Autonomous Scaffolding**: Initializes a production-ready environment in the dynamic `output/` directory.
- **Agentic Coding**: Uses a tool-calling loop with the **[@google/genai SDK](https://www.npmjs.com/package/@google/genai)** to write components, styles, and logic.
- **Self-Healing Build System**: If the application fails to build, Vibe Coder captures the compiler errors and asks the AI to fix them—retrying up to 5 times.
- **Automated Preview/Serve**: Once the build is successful, it automatically launches the app (`npm run preview` for React, `npm run start` for Angular).

## 📁 Project Structure

- `src/flows/`: Core logic for different stages of the lifecycle.
  - `scaffoldApp.ts`: Initializes the output directory based on the chosen framework.
  - `createApp.ts`: The main AI agentic loop for writing code.
  - `buildApp.ts`: Handles the build process and automated bug fixing.
  - `startApp.ts`: Runs the final production-ready application.
- `src/prompts/`: Framework-aware templates for system instructions and build-error context.
- `src/tools/`: The set of tools the AI can use (filesystem operations, listing files, etc.).
- `output/`: The dynamic directory where your generated app lives (relative to the project root).

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
Run the main script with your request and framework choice:

**React (Default):**
```bash
npm run dev -- --prompt "build me a beautiful glassmorphic multi-step signup form" --framework react
```

**Angular:**
```bash
npm run dev -- --prompt "build me a simple todo app" --framework angular
```

*Note: You can also use `npx tsx src/index.ts` directly.*

## 🛠️ How it Works

1. **Scaffold**: A framework-specific template (React/Vite or Angular) is initialized in the `output/` folder.
2. **Create**: The AI agent analyzes the prompt and begins calling tools to create files, with system instructions tailored to the chosen framework.
3. **Build**: The system runs `npm run build`. 
4. **Fix**: If the build fails, the agent reads the error logs, looks at the code, and applies framework-specific fixes.
5. **Preview/Serve**: Once error-free, the app is launched using the appropriate command (`npm run preview` or `npm run start`).

## 🗺️ Roadmap (To-Do)

- [ ] **Expanded Toolset**: Add more advanced tools like `grep`, `edit_file` (for targeted edits), and `git` integration.
- [ ] **Spec-Driven Development**: Implement a flow where the agent writes an implementation plan and creates tasks, marking them as completed during execution.
- [ ] **Detailed Worklog**: Log exactly what the agent did in each turn for better transparency.
- [ ] **MCP & Skills Support**: Integrate with Model Context Protocol and external skills.
- [ ] **Enhanced CLI UI**: Improve the terminal interface with better formatting, progress bars, and status updates.
- [ ] **Multi-provider SDK Support**: Support OpenAI and Anthropic SDKs alongside Gemini.
- [ ] **State Persistence**: Integrate SQLite to persist the snapshot so that you can pick up from where you left off.
- [ ] **Automated Evals**: Implement a framework to evaluate the agent's performance and accuracy across various prompts.
- [ ] **YAML Prompt Templates**: Move hardcoded prompts into external YAML files for better maintainability and customization.

## ✅ Done

- [x] **Decouple harness from the Create App flow**: Modularize the core agentic loop for better reusability.

## 📝 License
MIT


