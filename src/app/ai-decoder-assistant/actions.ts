
'use server';

import { decodeCanSignals, type DecodeCanSignalsInput, type AiDecoderAssistantOutput } from '@/ai/flows/decode-can-signals-flow';

export interface AiDecoderResult {
  success: boolean;
  data?: AiDecoderAssistantOutput;
  error?: string;
}

export async function askAiToDecodeCanMessages(rawMessages: string): Promise<AiDecoderResult> {
  if (!rawMessages || rawMessages.trim() === '') {
    return { success: false, error: 'CAN messages cannot be empty.' };
  }

  const input: DecodeCanSignalsInput = {
    rawCanMessages: rawMessages,
  };

  try {
    const output = await decodeCanSignals(input);
    return { success: true, data: output };
  } catch (error) {
    console.error('AI Decoder Assistant Error:', error);
    let errorMessage = 'An unexpected error occurred during AI analysis.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
