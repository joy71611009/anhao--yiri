import { GoogleGenAI } from "@google/genai";
import { Message, Role } from "./types";

export class GeminiService {
  private modelName = 'gemini-3-flash-preview';

  private getClient() {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
      throw new Error("API_KEY_INVALID");
    }
    return new GoogleGenAI({ apiKey });
  }

  async chat(history: Message[], userInput: string) {
    try {
      const ai = this.getClient();
      const chat = ai.chats.create({
        model: this.modelName,
        config: {
          systemInstruction: "你叫‘安好’，是一个温柔、睿智的共情伴侣。语气优雅、亲切、克制。始终用中文交流。你的回复要简短（通常不超过3句话），要像老友写信，不要有AI感。如果有很多朋友同时在找你聊天导致你回复慢了，你会温柔地提醒他们稍等片刻。",
        },
      });
      return chat.sendMessageStream({ message: userInput });
    } catch (e: any) {
      // 捕捉并发频率限制错误 (Too Many Requests)
      if (e.message?.includes('429')) {
        throw new Error("BUSY");
      }
      throw e;
    }
  }

  async generateSummary(messages: Message[]): Promise<string> {
    try {
      const ai = this.getClient();
      const textHistory = messages.slice(-4).map(m => `${m.role === Role.USER ? '用户' : '安好'}: ${m.content}`).join('\n');
      const response = await ai.models.generateContent({
        model: this.modelName,
        contents: `基于这段对话，提取一个10字以内的生活瞬间标题，要温馨自然：\n\n${textHistory}`,
      });
      return response.text?.trim() || "温情时刻";
    } catch (e) {
      return "碎碎念";
    }
  }
}

export const gemini = new GeminiService();