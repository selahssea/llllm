import Chat from './components/Chat';
import ThemeSelector from './components/ThemeSelector';
import {
  PencilSquareIcon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleBottomCenterIcon,
} from '@heroicons/react/24/outline';

export default function App() {
  return (
    <div className="flex h-[100dvh] flex-col border-t-1 border-teal-300 dark:border-teal-300/10 divide-y divide-teal-300 dark:divide-teal-300/10 dark:bg-teal-950 dark:caret-yellow-500">
      <header className="flex h-14 shrink-0 divide-x divide-teal-300 dark:divide-teal-300/10">
        <a
          className="flex aspect-square h-full items-center justify-center hover:bg-teal-300/30 dark:hover:bg-teal-800"
          href="/"
          title="Lame Local LLM"
        >
          <img
            src="/llllm.svg"
            className="w-8 mr-1 mt-0.5 dark:opacity-70"
            alt="LLLLM"
          />
        </a>
        <div className="grow items-center justify-end gap-3 px-4 py-2 sm:flex"></div>
        <div className="flex items-center justify-center">
          <ThemeSelector />
        </div>
      </header>
      <section className="flex flex-1 overflow-hidden lg:divide-x divide-teal-300 dark:divide-teal-300/10">
        <div className="relative">
          <aside className="hidden h-full w-[300px] flex-col divide-y divide-teal-300 dark:divide-teal-300/10 lg:flex">
            <nav>
              <ul className="dark:text-teal-700 divide-teal-300 divide-y dark:divide-teal-300/10 cursor-pointer">
                <li className="p-3 hover:bg-teal-100/70 dark:hover:bg-teal-800 dark:hover:text-teal-400">
                  <PencilSquareIcon className="w-6 inline align-top mr-2" />
                  New conversation
                </li>
                <li className="p-3 bg-teal-50 hover:bg-teal-100/70 dark:bg-teal-900 dark:hover:bg-teal-800">
                  <ChatBubbleBottomCenterTextIcon className="w-6 inline align-top mr-2" />
                  Current chat
                </li>
                <li className="p-3 hover:bg-teal-100/70 dark:hover:bg-teal-800 dark:hover:text-teal-400">
                  <ChatBubbleBottomCenterIcon className="w-6 inline align-top mr-2" />
                  Old chat
                </li>
                <li className="p-3 hover:bg-teal-100/70 dark:hover:bg-teal-800 dark:hover:text-teal-400">
                  <ChatBubbleBottomCenterIcon className="w-6 inline align-top mr-2" />
                  Older chat
                </li>
                <li className="p-3 hover:bg-teal-100/70 dark:hover:bg-teal-800 dark:hover:text-teal-400">
                  <ChatBubbleBottomCenterIcon className="w-6 inline align-top mr-2" />
                  The oldest
                </li>
              </ul>
            </nav>
          </aside>
        </div>
        <main className="flex flex-1 flex-col divide-y">
          <Chat />
        </main>
      </section>
    </div>
  );
}
