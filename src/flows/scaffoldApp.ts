import fs from 'fs';
import { execSync } from 'child_process';
import { OUTPUT_DIR } from '../config';

export function scaffoldApp() {
  if (fs.existsSync(OUTPUT_DIR)) {
    console.log(`Cleaning up existing directory: ${OUTPUT_DIR}`);
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log("Scaffolding React app in OUTPUT_DIR...");
  // Using npx create-vite to generate a React app in the given directory
  execSync('npm create vite@5.2.0 --yes . -- --template react-ts', {
    cwd: OUTPUT_DIR,
    stdio: 'inherit'
  });
  console.log("React app scaffolded successfully.");

  console.log("Initializing git repository for tracking changes...");
  try {
    execSync('git init && git add . && git commit -m "initial scaffold"', {
      cwd: OUTPUT_DIR,
      stdio: 'inherit'
    });
    console.log("Git repository initialized.");
  } catch (e) {
    console.error("Failed to initialize git repository. Ensure git is installed and user.email/user.name are configured.");
  }
}
