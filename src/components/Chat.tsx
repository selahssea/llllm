import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import MarkdownMessage from './ui/MarkdownMessage';
import { type Message } from '../types/interfaces';
import { useChatContext } from '../context/ChatContext';

const OLLAMA_API_URL = `${import.meta.env.VITE_OLLAMA_URL || ''}/api/chat`;
const MODEL = 'llama3.2';

export default function Chat() {
  const {
    activeChat,
    addMessage,
    updateLastMessage,
    finalizeStreamingMessage,
  } = useChatContext();

  const [value, setValue] = useState('');
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
    if (!activeChat) return;

    updateLastMessage(activeChat.id, chunk);
    scrollToBottom();
  };

  // Handle user sending a message (Enter without Shift)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return;

    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || !activeChat) return;

    sendUserMessage(trimmed);
  };

  // Core send logic
  const sendUserMessage = (content: string) => {
    if (!activeChat) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now().toString(),
    };

    // Add user message + empty streaming assistant placeholder
    addMessage(activeChat.id, userMessage);
    addMessage(activeChat.id, {
      id: uuidv4(),
      role: 'assistant',
      content: '',
      timestamp: Date.now().toString(),
      isStreaming: true,
    });

    setValue('');
    scrollToBottom();
    focusInput();

    streamOllamaResponse(content);
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || !activeChat) return;

    sendUserMessage(trimmed);
  };

  // Stream response from Ollama and update UI live
  const streamOllamaResponse = async (userContent: string) => {
    if (!activeChat) return;

    try {
      const res = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            ...activeChat.messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
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
              finalizeStreamingMessage(activeChat.id);
            }
          } catch {}
        }
      }
    } catch (err) {
      console.error('Ollama streaming error:', err);
    }
  };

  if (!activeChat) {
    return (
      <div className="flex flex-col h-full p-4 bg-teal-50 dark:bg-teal-950 max-w-4xl items-center justify-center">
        <p className="text-teal-500/70 dark:text-teal-400/30">
          Select or create a chat from the sidebar
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 bg-teal-50 dark:bg-teal-950 max-w-4xl">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {activeChat.messages.map((msg) => (
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
          placeholder="Ask anything… (Shift + Enter for new line)"
          className="flex-1 rounded-xs border border-teal-300 dark:border-teal-600/20 bg-white dark:bg-teal-900 px-4 py-3 text-gray-900 dark:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/10 resize-none min-h-19 max-h-40"
          rows={2}
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!value.trim()}
          className="flex h-19 w-12 items-center justify-center rounded-xs bg-teal-600 text-white disabled:bg-gray-400 dark:disabled:bg-teal-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
