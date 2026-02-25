import { useRef, useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import MarkdownMessage from './ui/MarkdownMessage';

export type Role = 'user' | 'assistant';

export interface Message {
  id?: string;
  role: Role;
  content: string;
  timestamp?: string;
  isStreaming?: boolean;
}

const OLLAMA_API_URL = `${import.meta.env.VITE_OLLAMA_URL || ''}/api/chat`;
const MODEL = 'llama3.2';

export default function Chat() {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helpers
  const focusInput = () => {
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Append chunk to the last assistant message (streaming)
  const appendToLastAssistantMessage = (chunk: string) => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last?.role === 'assistant' && last.isStreaming) {
        updated[updated.length - 1] = {
          ...last,
          content: last.content + chunk,
        };
      }
      return updated;
    });
    scrollToBottom();
  };

  // Mark last assistant message as finished (remove streaming flag)
  const finalizeLastAssistantMessage = () => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last?.role === 'assistant' && last.isStreaming) {
        updated[updated.length - 1] = {
          ...last,
          isStreaming: false,
        };
      }
      return updated;
    });
  };

  // Handle user sending a message (Enter without Shift)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return;

    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    sendUserMessage(trimmed);
  };

  // Core send logic
  const sendUserMessage = (content: string) => {
    const userMessage: Message = {
      // id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now().toString(),
    };

    // Add user message + empty streaming assistant placeholder
    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        // id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: Date.now().toString(),
        isStreaming: true,
      },
    ]);

    setValue('');
    setIsLoading(true);
    scrollToBottom();
    focusInput();

    streamOllamaResponse(content);
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    sendUserMessage(trimmed);
  };

  // Stream response from Ollama and update UI live
  const streamOllamaResponse = async (userContent: string) => {
    try {
      const res = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userContent },
          ],
          stream: true,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No stream');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const parsed = JSON.parse(line);
            if (parsed.message?.content) {
              accumulated += parsed.message.content;
              appendToLastAssistantMessage(parsed.message.content);
            }
            if (parsed.done) {
              finalizeLastAssistantMessage();
            }
          } catch {}
        }
      }
    } catch (err) {
      // For now, just log (error handling to be added later)
      console.error('Ollama streaming error:', err);
    } finally {
      setIsLoading(false);
      focusInput();
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-teal-50 dark:bg-teal-950 max-w-4xl">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg) => (
          <div
            key={msg.id ?? msg.timestamp}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'user' ? (
              <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-teal-600 text-white">
                {msg.content}
              </div>
            ) : (
              <MarkdownMessage message={msg} />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Ask anything… (Shift + Enter for new line)"
          className="flex-1 rounded-xs border border-teal-300 dark:border-teal-600/20 bg-white dark:bg-teal-900 px-4 py-3 text-gray-900 dark:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/10 resize-none min-h-19 max-h-[160px]"
          rows={2}
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className="flex h-19 w-12 items-center justify-center rounded-xs bg-teal-600 text-white disabled:bg-gray-400 dark:disabled:bg-teal-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
