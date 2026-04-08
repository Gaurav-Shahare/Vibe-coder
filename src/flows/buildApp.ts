import { execSync } from 'child_process';
import { OUTPUT_DIR } from '../config';
import { createApp } from './createApp';
import { getBuildFixPrompt } from '../prompts/buildApp';
import { getFileTree } from '../tools';

export async function buildApp(userPrompt: string, retries = 5): Promise<boolean> {
  let attempt = 0;

  while (attempt < retries) {
    attempt++;
    console.log(`\n📦 Building the app (Attempt ${attempt}/${retries})...`);

    try {
      console.log("Running npm install...");
      execSync('npm install', { cwd: OUTPUT_DIR, stdio: 'inherit' });

      console.log("Running npm run build...");
      // Using pipe to capture output for AI context if it fails
      execSync('npm run build', { cwd: OUTPUT_DIR, stdio: 'inherit' });

      console.log("✅ Build successful!");
      return true;
    } catch (e: any) {
      console.error(`❌ Build failed on attempt ${attempt}.`);

      // Capture error message from stderr/stdout if possible
      // Since we used 'inherit', we might need to run it again with 'pipe' to capture for AI
      let buildError = "";
      try {
        execSync('npm run build', { cwd: OUTPUT_DIR, stdio: 'pipe' });
      } catch (err: any) {
        buildError = err.stderr?.toString() || err.stdout?.toString() || err.message;
      }
      if (attempt < retries) {
        console.log("🤖 Asking AI to fix the build errors...");
        const fileTree = getFileTree(OUTPUT_DIR);
        const fixPrompt = getBuildFixPrompt(fileTree, buildError, userPrompt);
        const fixSuccess = await createApp(userPrompt, fixPrompt);
        if (!fixSuccess) {
          console.error("❌ Agent failed to provide a fix within turn limits.");
        }
      } else {
        console.error("🚫 Maximum build retries reached. Manual intervention required.");
      }
    }
  }

  return false;
}
