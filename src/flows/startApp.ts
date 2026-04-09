import { execSync } from 'child_process';
import { OUTPUT_DIR } from '../config';

import { Framework } from '../types';

export function startApp(framework: Framework): void {
  const command = framework === Framework.ANGULAR ? 'npm run start' : 'npm run preview';
  console.log(`\n🚀 Starting the application (${framework} mode)...`);
  console.log(`Running: ${command}`);

  try {
    execSync(command, { cwd: OUTPUT_DIR, stdio: 'inherit' });
  } catch (e: any) {
    console.error("\n❌ Failed to start the application.");
    console.log(`Please check the 'scripts' section in your package.json to verify the correct command:`);
    console.log(`🔗 file://${OUTPUT_DIR}/package.json`);
  }
}

