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
import { program, Option } from 'commander';
import path from 'path';
import { Framework } from './types';

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

async function main(prompt: string, framework: Framework) {
  console.log("\n🚀 Welcome to the Vibe Coding Platform!");
  console.log(`✨ User asked to build: "${prompt}" using ${framework}\n`);

  scaffoldApp(framework);

  console.log("Starting Gen AI Agent...");
  const createSuccess = await createApp(prompt, framework);
  if (!createSuccess) {
    console.error("❌ Agent failed to finish creating the app within turn limits.");
    return;
  }
  console.log("Agent finished creating app");

  const buildSuccess = await buildApp(prompt, framework);
  if (buildSuccess) {
    console.log("🎉 All set! Your app is built and ready.");
    startApp(framework);
  } else {
    console.error("❌ Build failed after all retries.");
  }
}

program
  .name('vibe-coder')
  .description('A GenAI-powered coding agent to scaffold and build React apps')
  .version(pkg.version)
  .argument('[prompt]', 'Initial prompt for the app', 'build me a tic tac toe')
  .option('-p, --prompt <string>', 'Initial prompt for the app')
  .addOption(new Option('-f, --framework <type>', 'framework to use').choices(['react', 'angular']).default('react'))
  .parse(process.argv);

const options = program.opts();
const cliPrompt = options.prompt || program.args[0] || 'build me a tic tac toe';
const framework = options.framework as Framework;

main(cliPrompt, framework);