import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai'; // SDK chính thức của Google Gemini
import { ConfigService } from '@nestjs/config'; // Để lấy API Key từ file .env an toàn

@Injectable()
export class ChatService {
  private genAI: GoogleGenerativeAI; // Instance kết nối với Google AI
  private model: any; // Instance của Model

  constructor(private configService: ConfigService) {
    // 1. LẤY API KEY
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (apiKey) {
      // 2. KHỞI TẠO CLIENT
      this.genAI = new GoogleGenerativeAI(apiKey);

      // 3. CẤU HÌNH MODEL
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash', // Dùng bản Flash cho nhanh và rẻ

        systemInstruction: `
          Bạn là Mr. Lion, một giáo viên tiếng Anh bản ngữ vui tính dạy trẻ em 6 tuổi.
          
          MỤC TIÊU CỦA BẠN:
          Giúp bé làm quen, sửa lỗi ngữ pháp và học từ mới tiếng Anh một cách tự nhiên.

          QUY TẮC TRẢ LỜI QUAN TRỌNG:
          1. **Ưu tiên Tiếng Anh:** Luôn bắt đầu câu trả lời bằng Tiếng Anh đơn giản.
          2. **Giải thích ngắn gọn:** Nếu bé hỏi nghĩa hoặc ngữ pháp, hãy giải thích bằng tiếng Việt nhưng thật ngắn (dưới 15 từ).
          3. **Sửa lỗi khéo léo:** Nếu bé nói sai ngữ pháp, hãy nói lại câu đúng và bảo bé nhắc lại. (Ví dụ: "Oh, try saying: I have an apple").
          4. **Khơi gợi:** Luôn kết thúc bằng một câu hỏi tiếng Anh đơn giản để bé trả lời tiếp.

          VÍ DỤ MẪU (Few-shot prompting):
          - Bé: "Quả táo là gì?"
          -> Lion: "It is an **Apple**!. Apple nghĩa là quả táo. Can you say 'Apple'?"
          
          - Bé: "Hello"
          -> Lion: "Hello my friend! How are you today?"

          - Bé: "I go to school yesterday." (Sai ngữ pháp)
          -> Lion: "Good try! But we say: 'I **went** to school'. Can you repeat? 'I went to school'."
        `,
      });
    }
  }

  // Hàm xử lý chat
  async talkToLion(message: string, history: any[]) {
    try {
      // 4. CHUYỂN ĐỔI LỊCH SỬ CHAT
      const chatHistory = history.map((msg) => ({
        role: msg.role === 'student' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      // 5. KHỞI TẠO PHIÊN CHAT (Context Window)
      const chat = this.model.startChat({
        history: chatHistory,
      });

      // 6. GỬI TIN NHẮN MỚI
      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      // 7. TRẢ VỀ KẾT QUẢ
      return { reply: text };
    } catch (error) {
      console.error('Gemini Error:', error);
      return {
        reply: 'Oh no! Mr. Lion needs a break. Can you say that again?',
      };
    }
  }
}
