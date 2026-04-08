import fs from 'fs';
import { execSync } from 'child_process';
import { ai } from './utils';
import { OUTPUT_DIR } from './config';
import { getFileTree, tools, toolHandlers } from './tools';

enum State {
  SCAFFOLDING,
  WRITING_CODE,
  DONE
}


import { createApp } from './flows/createApp';
import { buildApp } from './flows/buildApp';
import { startApp } from './flows/startApp';

import { scaffoldApp } from './flows/scaffoldApp';

async function main(prompt: string) {
  console.log("\n🚀 Welcome to the Vibe Coding Platform!");
  console.log(`✨ User asked to build: "${prompt}"\n`);

  scaffoldApp();

  console.log("Starting Gen AI Agent...");
  const createSuccess = await createApp(prompt);
  if (!createSuccess) {
    console.error("❌ Agent failed to finish creating the app within turn limits.");
    return;
  }
  console.log("Agent finished creating app");

  const buildSuccess = await buildApp(prompt);
  if (buildSuccess) {
    console.log("🎉 All set! Your app is built and ready.");
    startApp();
  } else {
    console.error("❌ Build failed after all retries.");
  }
}

const cliPrompt = process.argv[2] || "build me a tic tac toe";
main(cliPrompt);