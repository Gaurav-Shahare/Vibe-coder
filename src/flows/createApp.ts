import { OUTPUT_DIR } from '../config';
import { getFileTree, tools, toolHandlers } from '../tools';
import { getSystemPrompt } from '../prompts/createApp';
import { Framework } from '../types';
import { runAgent } from '../agent/harness';

export async function createApp(userPrompt: string, framework: Framework, customSystemPrompt?: string): Promise<boolean> {
  const fileTree = getFileTree(OUTPUT_DIR);
  const systemPrompt = customSystemPrompt || getSystemPrompt(fileTree, userPrompt, framework);

  return runAgent({
    systemPrompt,
    tools,
    toolHandlers
  });
}

