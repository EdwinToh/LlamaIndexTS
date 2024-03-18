import { ChatPromptTemplate, PromptTemplate } from "llamaindex";
import type {
  ChatMessage,
  ChatResponse,
  ChatResponseChunk,
  CompletionResponse,
  LLM,
  LLMChatParamsNonStreaming,
  LLMChatParamsStreaming,
  LLMCompletionParamsNonStreaming,
  LLMCompletionParamsStreaming,
  LLMMetadata,
} from "./types.js";
import { streamConverter } from "./utils.js";

export abstract class BaseLLM implements LLM {
  abstract metadata: LLMMetadata;

  predict(
    params: LLMCompletionParamsStreaming,
  ): Promise<AsyncIterable<CompletionResponse>>;
  predict(params: LLMCompletionParamsNonStreaming): Promise<CompletionResponse>;
  async predict(
    params: LLMCompletionParamsStreaming | LLMCompletionParamsNonStreaming,
  ): Promise<CompletionResponse | AsyncIterable<CompletionResponse>> {
    const { prompt, parentEvent, stream } = params;

    if (prompt instanceof ChatPromptTemplate) {
      if (stream) {
        const stream = await this.chat({
          messages: prompt.formatMessages(),
          parentEvent,
          stream: true,
        });
        return streamConverter(stream, (chunk) => {
          return {
            text: chunk.delta,
          };
        });
      }

      const chatResponse = await this.chat({
        messages: prompt.formatMessages(),
        parentEvent,
      });
      return { text: chatResponse.message.content as string };
    }

    if (prompt instanceof PromptTemplate) {
      if (stream) {
        const stream = await this.complete({
          prompt: prompt.format(),
          parentEvent,
          stream: true,
        });

        return stream;
      }

      return this.complete({
        prompt: prompt.format(),
        parentEvent,
      });
    }

    if (stream) {
      const stream = await this.complete({
        prompt,
        parentEvent,
        stream: true,
      });

      return stream;
    }

    return this.complete({
      prompt,
      parentEvent,
    });
  }

  complete(
    params: LLMCompletionParamsStreaming,
  ): Promise<AsyncIterable<CompletionResponse>>;
  complete(
    params: LLMCompletionParamsNonStreaming,
  ): Promise<CompletionResponse>;
  async complete(
    params: LLMCompletionParamsStreaming | LLMCompletionParamsNonStreaming,
  ): Promise<CompletionResponse | AsyncIterable<CompletionResponse>> {
    const { prompt, parentEvent, stream } = params;
    if (stream) {
      const stream = await this.chat({
        messages: [{ content: prompt, role: "user" }],
        parentEvent,
        stream: true,
      });
      return streamConverter(stream, (chunk) => {
        return {
          text: chunk.delta,
        };
      });
    }
    const chatResponse = await this.chat({
      messages: [{ content: prompt, role: "user" }],
      parentEvent,
    });
    return { text: chatResponse.message.content as string };
  }

  abstract chat(
    params: LLMChatParamsStreaming,
  ): Promise<AsyncIterable<ChatResponseChunk>>;
  abstract chat(params: LLMChatParamsNonStreaming): Promise<ChatResponse>;

  abstract tokens(messages: ChatMessage[]): number;
}
