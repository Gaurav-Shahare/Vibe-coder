import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { OUTPUT_DIR } from './config';

export function getFileTree(dir: string): string[] {
  try {
    const output = execSync('find . -maxdepth 3 -not -path "*/.*" -not -path "./node_modules*"', { cwd: dir }).toString();
    return output.split('\n').filter(line => line && line !== '.');
  } catch (e) {
    return [];
  }
}

export const tools: any = {
  functionDeclarations: [
    {
      name: 'list_files',
      description: 'Lists all files in the project directory recursively.',
      parameters: { type: 'object', properties: {} }
    },
    {
      name: 'read_file',
      description: 'Reads the content of a file.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Relative path to the file.' }
        },
        required: ['path']
      }
    },
    {
      name: 'write_file',
      description: 'Writes or overwrites a file in the project directory.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Relative path to the file from the project root.' },
          content: { type: 'string', description: 'The full content to write to the file.' }
        },
        required: ['path', 'content']
      }
    }
  ]
};

export const toolHandlers: Record<string, (args: any) => any> = {
  list_files: () => {
    return { files: getFileTree(OUTPUT_DIR) };
  },
  read_file: ({ path: filePath }: { path: string }) => {
    const fullPath = path.join(OUTPUT_DIR, filePath);
    if (!fs.existsSync(fullPath)) return { error: `File ${filePath} not found.` };
    return { content: fs.readFileSync(fullPath, 'utf-8') };
  },
  write_file: ({ path: filePath, content }: { path: string; content: string }) => {
    const fullPath = path.join(OUTPUT_DIR, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
    return { success: true };
  }
};
