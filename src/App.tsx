import Chat from './components/Chat';
import ThemeSelector from './components/ThemeSelector';
import { ChatProvider } from './context/ChatContext';
import ChatMenu from './components/ChatMenu';

export default function App() {
  return (
    <div className="flex h-[100dvh] flex-col border-t-1 border-teal-300 dark:border-teal-300/10 divide-y divide-teal-300 dark:divide-teal-300/10 dark:bg-teal-950 dark:caret-yellow-500">
      <ChatProvider>
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
          <div className="block overflow-x-auto whitespace-nowrap flex-1 grow md:hidden">
            <ChatMenu />
          </div>
          <div className="flex items-center justify-center ml-auto">
            <ThemeSelector />
          </div>
        </header>
        <section className="flex flex-1 overflow-hidden md:divide-x divide-teal-300 dark:divide-teal-300/10">
          <div className="relative">
            <aside className="hidden h-full w-[300px] flex-col divide-y divide-teal-300 dark:divide-teal-300/10 md:flex">
              <ChatMenu />
            </aside>
          </div>
          <main className="flex flex-1 flex-col divide-y">
            <Chat />
          </main>
        </section>
      </ChatProvider>
    </div>
  );
}
