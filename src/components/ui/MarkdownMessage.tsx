import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { type Message } from '../Chat';

interface MarkdownMessageProps {
  message: Message;
}

export default function MarkdownMessage({ message }: MarkdownMessageProps) {
  const contentWithCursor = message.isStreaming
    ? `${message.content}<span class="inline-block w-1.5 h-4 ml-1 bg-current animate-pulse">|</span>`
    : message.content;

  return (
    <div
      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
        message.role === 'user'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
      }`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {contentWithCursor || 'Thinking...'}
      </ReactMarkdown>
    </div>
  );
}
