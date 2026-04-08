import { ai } from '../utils';
import { OUTPUT_DIR } from '../config';
import { getFileTree, tools, toolHandlers } from '../tools';
import { getSystemPrompt } from '../prompts/createApp';

export async function createApp(userPrompt: string, customSystemPrompt?: string): Promise<boolean> {
  const model = "gemini-3-flash-preview"; // More capable model for tool use
  const fileTree = getFileTree(OUTPUT_DIR);

  let messages: any[] = [
    {
      role: 'user',
      parts: [{
        text: customSystemPrompt || getSystemPrompt(fileTree, userPrompt)
      }]
    }
  ];

  let turns = 0;
  const MAX_TURNS = 20;

  while (turns < MAX_TURNS) {
    turns++;
    console.log(`\n--- Agent Turn ${turns} ---`);
    const result = await ai.models.generateContent({
      model: model,
      contents: messages,
      config: { tools: [tools] }
    });

    // 1. Add the model's response to messages
    const responseItem = result.candidates?.[0]?.content;
    if (!responseItem) break;
    messages.push(responseItem);

    if (result.text) {
      console.log("Agent:", result.text);
    }

    const calls = result.functionCalls;

    // 2. If no tool calls, the agent is done
    if (!calls || calls.length === 0) {
      console.log("No tool calls. Agent is done.");
      return true;
    }

    // 3. Process each tool call
    const functionResponses = [];
    for (const call of calls) {
      const toolName = call.name;
      if (!toolName) continue;

      if (toolName in toolHandlers) {
        console.log(`Calling tool: ${toolName} with args:`, call.args);
        const handler = toolHandlers[toolName];
        const toolResult = handler(call.args);

        functionResponses.push({
          functionResponse: {
            name: toolName,
            response: toolResult
          }
        });
      } else {
        console.warn(`Warning: Tool "${toolName}" called by model but not found in handlers.`);
        functionResponses.push({
          functionResponse: {
            name: toolName,
            response: { error: `Tool "${toolName}" not found.` }
          }
        });
      }
    }

    // 4. Add tool responses back to the conversation
    if (functionResponses.length > 0) {
      messages.push({
        role: 'user',
        parts: functionResponses
      });
    }
  }

  if (turns >= MAX_TURNS) {
    console.log("Reached maximum safety turns limit.");
    return false;
  }

  return true;
}
