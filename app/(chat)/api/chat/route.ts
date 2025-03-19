// Import necessary dependencies for the chat API route
import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { isProductionEnvironment } from '@/lib/constants';
import { myProvider } from '@/lib/ai/providers';
import { getUberEatsRecommendations, linkUberEatsAccount, getHealthierAlternatives } from '@/lib/ai/tools/ubereats';

// Type definitions for AI streaming functionality
type DataStream = {
  append: (chunk: string) => void;
  close: () => void;
};

interface UIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  parts?: any[];
  experimental_attachments?: any[];
}

interface StreamTextOptions {
  model: any;
  system: string;
  messages: UIMessage[];
  maxSteps: number;
  experimental_activeTools: string[];
  experimental_transform: any;
  experimental_generateMessageId: () => string;
  tools?: Record<string, any>;
  onFinish?: (data: { response: { messages: UIMessage[] } }) => Promise<void>;
  experimental_telemetry?: boolean | { isEnabled: boolean; functionId: string; };
}

const streamText = (options: StreamTextOptions) => {
  // Implementation would be here in a real app
  return {
    on: (event: string, callback: (data: any) => void) => {},
    consumeStream: (callback: (chunk: string) => void) => {},
    mergeIntoDataStream: (dataStream: DataStream) => {}
  };
};

const createDataStreamResponse = ({ execute, onError }: { execute: (dataStream: DataStream) => any, onError?: (error: any) => void }) => {
  return new Response(new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const dataStream = {
        append: (chunk: string) => {
          controller.enqueue(encoder.encode(chunk));
        },
        close: () => {
          controller.close();
        }
      };
      try {
        execute(dataStream);
      } catch (error) {
        if (onError) onError(error);
        controller.close();
      }
    }
  }));
};

const smoothStream = ({ chunking }: { chunking: string }) => {
  return (response: any) => response;
};

const appendResponseMessages = (messages: UIMessage[], message: UIMessage) => {
  return [...messages, message];
};

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const {
      id,
      messages,
      selectedChatModel,
    }: {
      id: string;
      messages: Array<UIMessage>;
      selectedChatModel: string;
    } = await request.json();

    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return new Response('No user message found', { status: 400 });
    }

    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });

      await saveChat({ id, userId: session.user.id, title });
    } else {
      if (chat.userId !== session.user.id) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: userMessage.id,
          role: 'user',
          parts: userMessage.parts,
          attachments: userMessage.experimental_attachments ?? [],
          createdAt: new Date(),
        },
      ],
    });

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: systemPrompt(),
          messages,
          maxSteps: 5,
          experimental_activeTools: [
                  'getUberEatsRecommendations',
                  'getHealthierAlternatives',
                  'linkUberEatsAccount',
                ],
          experimental_transform: smoothStream({ chunking: 'word' }),
          experimental_generateMessageId: generateUUID,
          // Only include UberEats-related tools that are needed for the dietary recommendation chatbot
          tools: {
            getUberEatsRecommendations: getUberEatsRecommendations({ session, dataStream }),
            linkUberEatsAccount: linkUberEatsAccount({ session, dataStream }),
            getHealthierAlternatives: getHealthierAlternatives({ session, dataStream }),
          },
          onFinish: async ({ response }) => {
            if (session.user?.id) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === 'assistant',
                  ),
                });

                if (!assistantId) {
                  throw new Error('No assistant message found!');
                }

                const assistantMessage = response.messages.find(
                  (message) => message.role === 'assistant' && message.id === assistantId
                );
                
                if (!assistantMessage) {
                  throw new Error('Assistant message not found');
                }

                await saveMessages({
                  messages: [
                    {
                      id: assistantId,
                      chatId: id,
                      role: assistantMessage.role,
                      content: assistantMessage.content,
                      createdAt: new Date(),
                    },
                  ],
                });
              } catch (error) {
                console.error('Failed to save chat');
              }
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: 'stream-text',
          },
        });

        result.consumeStream((chunk: string) => {
          // Process chunks as needed
        });

        result.mergeIntoDataStream(dataStream);
      },
      onError: () => {
        return 'Oops, an error occured!';
      },
    });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 404,
    });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}
