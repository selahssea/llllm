import { createContext, useContext, useState, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { type Message, type Chat } from '../types/interfaces';

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  createNewChat: () => void;
  setActiveChat: (id: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateLastMessage: (chatId: string, chunk: string) => void;
  deleteChat: (id: string) => void;
  finalizeStreamingMessage: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  const createNewChat = () => {
    const id = uuidv4();
    const newChat: Chat = {
      id,
      title: `Chat ${chats.length + 1}`,
      messages: [],
      createdAt: new Date().toLocaleString(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(id);
  };

  const addMessage = (chatId: string, message: Message) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              updatedAt: new Date().toLocaleString(),
              messages: [...chat.messages, message],
            }
          : chat,
      ),
    );
  };

  const finalizeStreamingMessage = (chatId: string) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat;
        const messages = [...chat.messages];
        const last = messages[messages.length - 1];
        if (last?.role === 'assistant' && last.isStreaming) {
          messages[messages.length - 1] = {
            ...last,
            isStreaming: false,
          };
          chat.updatedAt = new Date().toLocaleString();
        }
        return { ...chat, messages };
      }),
    );
  };

  const updateLastMessage = (chatId: string, chunk: string) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat;
        const messages = [...chat.messages];
        const last = messages[messages.length - 1];
        if (last && last.role === 'assistant') {
          messages[messages.length - 1] = {
            ...last,
            content: (last.content || '') + chunk,
          };
        }
        return { ...chat, messages };
      }),
    );
  };

  const deleteChat = (id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      setActiveChatId(chats[0]?.id || null);
    }
  };

  const value = {
    chats,
    activeChat,
    createNewChat,
    setActiveChat: setActiveChatId,
    addMessage,
    updateLastMessage,
    deleteChat,
    finalizeStreamingMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context)
    throw new Error('useChatContext must be used within ChatProvider');
  return context;
};
