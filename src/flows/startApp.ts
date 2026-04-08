import { execSync } from 'child_process';
import { OUTPUT_DIR } from '../config';

export function startApp(): void {
  console.log("\n🚀 Starting the application (preview mode)...");
  console.log("Running: npm run preview");

  try {
    execSync('npm run preview', { cwd: OUTPUT_DIR, stdio: 'inherit' });
  } catch (e: any) {
    console.error("\n❌ Failed to start the application.");
    console.log(`Please check the 'scripts' section in your package.json to verify the correct command:`);
    console.log(`🔗 file://${OUTPUT_DIR}/package.json`);
  }
}
