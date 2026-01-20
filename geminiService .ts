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
          systemInstruction: "你叫‘安好’，是一个温柔、睿智的共情伴侣。语气优雅、亲切、克制。始终用中文交流，像多年未见的老友在写信。不要说长篇大论，要简短且有温度。",
        },
      });
      return chat.sendMessageStream({ message: userInput });
    } catch (e: any) {
      console.error("Gemini Chat Error:", e);
      throw e;
    }
  }

  async generateSummary(messages: Message[]): Promise<string> {
    try {
      const ai = this.getClient();
      const textHistory = messages.slice(-4).map(m => `${m.role === Role.USER ? '用户' : '安好'}: ${m.content}`).join('\n');
      const response = await ai.models.generateContent({
        model: this.modelName,
        contents: `基于这段对话，提取一个唯美的、10字以内的生活瞬间标题，直接输出标题，不要带引号：\n\n${textHistory}`,
      });
      return response.text?.trim() || "温情时刻";
    } catch (e) {
      return "碎碎念";
    }
  }
}

export const gemini = new GeminiService();