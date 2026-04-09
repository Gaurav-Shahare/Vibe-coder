import fs from 'fs';
import { execSync } from 'child_process';
import { OUTPUT_DIR } from '../config';
import { Framework } from '../types';

export function scaffoldApp(framework: Framework) {
  if (fs.existsSync(OUTPUT_DIR)) {
    console.log(`Cleaning up existing directory: ${OUTPUT_DIR}`);
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const scaffoldCommands = {
    [Framework.REACT]: 'npm create vite@5.2.0 --yes . -- --template react-ts',
    [Framework.ANGULAR]: 'NG_CLI_ANALYTICS=false npx -y @angular/cli@17 new vibe-app --directory . --defaults --skip-git --skip-install'
  };

  const command = scaffoldCommands[framework];
  const frameworkLabel = framework === Framework.REACT ? 'React' : 'Angular';

  console.log(`Scaffolding ${frameworkLabel} app in OUTPUT_DIR...`);
  try {
    execSync(command, {
      cwd: OUTPUT_DIR,
      stdio: 'inherit',
      input: framework === Framework.ANGULAR ? 'n' : undefined
    });
    console.log(`${frameworkLabel} app scaffolded successfully.`);
  } catch (e) {
    console.error(`Failed to scaffold ${frameworkLabel} app. Ensure Node.js and npm are installed and you have internet access.`);
    throw e;
  }

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
