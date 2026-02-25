import { useChatContext } from '../context/ChatContext';
import {
  PencilSquareIcon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleBottomCenterIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export default function ChatMenu() {
  const { chats, activeChat, createNewChat, deleteChat, setActiveChat } =
    useChatContext();

  return (
    <nav className="h-full md:overflow-y-auto">
      <ul className="dark:text-teal-700 divide-teal-300 md:divide-y h-full md:h-auto divide-x md:divide-x-0 dark:divide-teal-300/10 cursor-pointer md:block flex flex-row">
        <li
          onClick={createNewChat}
          className="p-3 hover:bg-teal-100/70 dark:hover:bg-teal-800 dark:hover:text-teal-400 flex items-center sticky"
        >
          <PencilSquareIcon className="w-6 inline align-top md:mr-2" />
          <span className="hidden md:inline">New conversation</span>
        </li>

        {chats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            className={`p-3 flex items-center justify-between group relative ${
              activeChat?.id === chat.id
                ? 'bg-teal-50 dark:bg-teal-900'
                : 'hover:bg-teal-100/70 dark:hover:bg-teal-800 dark:hover:text-teal-400'
            }`}
          >
            <div className="flex items-center flex-1 truncate">
              {activeChat?.id === chat.id ? (
                <ChatBubbleBottomCenterTextIcon className="w-6 inline align-top mr-2" />
              ) : (
                <ChatBubbleBottomCenterIcon className="w-6 inline align-top mr-2" />
              )}
              <span className="truncate">{chat.title}</span>
            </div>

            <small
              title="Created time"
              className="text-[9px] text-teal-800 opacity-70 group-hover:opacity-100 dark:text-teal-700 absolute top-0 right-1 hidden md:block"
            >
              {chat.createdAt}
            </small>

            <small
              title="Updated time"
              className="text-[9px] text-teal-800 dark:text-teal-700 absolute bottom-0 right-1 hidden md:group-hover:block"
            >
              {chat.updatedAt}
            </small>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Delete this chat?')) deleteChat(chat.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-orange-500 hover:text-red-700 p-1 rounded transition-opacity"
              title="Delete chat"
            >
              <TrashIcon className="w-3 h-3" />
            </button>
          </li>
        ))}

        {chats.length === 0 && (
          <li className="p-3 text-center text-teal-500/80 dark:text-teal-400/30 cursor-auto hidden md:block">
            No conversations yet
          </li>
        )}
      </ul>
    </nav>
  );
}
