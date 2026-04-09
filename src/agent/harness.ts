import { ai } from '../utils';

export interface AgentOptions {
  systemPrompt: string;
  tools: any;
  toolHandlers: Record<string, (args: any) => any>;
  model?: string;
  maxTurns?: number;
}

export async function runAgent(options: AgentOptions): Promise<boolean> {
  const {
    systemPrompt,
    tools,
    toolHandlers,
    model = "gemini-3-flash-preview",
    maxTurns = 20
  } = options;

  let messages: any[] = [
    {
      role: 'user',
      parts: [{ text: systemPrompt }]
    }
  ];

  let turns = 0;

  while (turns < maxTurns) {
    turns++;
    console.log(`\n--- Agent Turn ${turns} ---`);
    const result = await ai.models.generateContent({
      model: model,
      contents: messages,
      config: { tools: [tools] }
    });

    const responseItem = result.candidates?.[0]?.content;
    if (!responseItem) break;
    messages.push(responseItem);

    if (result.text) {
      console.log("Agent:", result.text);
    }

    const calls = result.functionCalls;

    if (!calls || calls.length === 0) {
      console.log("No tool calls. Agent is done.");
      return true;
    }

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

    if (functionResponses.length > 0) {
      messages.push({
        role: 'user',
        parts: functionResponses
      });
    }
  }

  if (turns >= maxTurns) {
    console.log("Reached maximum safety turns limit.");
    return false;
  }

  return true;
}
