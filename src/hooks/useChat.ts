import { useState, useCallback } from 'react';
import api from '../api/axios';

// ─── 타입 정의 ───────────────────────────────────────────────

export interface ChatMessage {
  id: string | number;
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

interface ChatSessionResponse {
  sessionId: number;
  botMessage: string;
  analysisResponse: string | null;
  analysisTriggered: boolean;
}

interface UseChatReturn {
  messages: ChatMessage[];
  sessionId: number | null;
  isLoading: boolean;
  startChat: (userId: number | string | undefined) => Promise<void>;
  // 💡 userId를 인자로 받도록 수정했습니다.
  sendMessage: (text: string, userId: number | string | undefined) => Promise<void>;
  resetChat: () => void;
}

// ─── 커스텀 훅 ───────────────────────────────────────────────

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. 채팅 세션 시작
  const startChat = useCallback(async (userId: number | string | undefined) => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // 명세: POST /api/chat-sessions/start?userId={id}
      const response = await api.post<any>('/api/chat-sessions/start', null, {
        params: { userId: Number(userId) }
      });
      
      const data: ChatSessionResponse = response.data?.data || response.data;
      setSessionId(data.sessionId);
      
      if (data.botMessage) {
        setMessages([
          {
            id: `bot-${Date.now()}`,
            role: 'ai',
            text: data.botMessage,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error: any) {
      console.error('Chat Start Error:', error.response?.data || error.message);
      setMessages([{
        id: 'error',
        role: 'ai',
        text: '대화를 시작하지 못했어요. 다시 시도해주세요.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. 메시지 전송
  const sendMessage = useCallback(async (text: string, userId: number | string | undefined) => {
    // 💡 sessionId와 userId가 모두 있어야 합니다.
    if (!sessionId || !userId || !text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      /** * 💡 수정 포인트: 
       * 1. URL Path: sessionId
       * 2. Body: contents
       * 3. Query Params: userId
       */
      const response = await api.post(
        `/api/chat-sessions/${sessionId}/messages`, 
        { content: text.trim() }, // Body
        { params: { userId: Number(userId) } } // Query Params 🚀
      );
      
      const data: ChatSessionResponse = response.data?.data || response.data;

      if (data.botMessage) {
        const aiMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'ai',
          text: data.botMessage,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }

      if (data.analysisTriggered) {
        console.log('분석이 시작되었습니다!');
      }

    } catch (error: any) {
      console.error('Send Message Error Details:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setIsLoading(false);
  }, []);

  return {
    messages,
    sessionId,
    isLoading,
    startChat,
    sendMessage,
    resetChat,
  };
};

export default useChat;