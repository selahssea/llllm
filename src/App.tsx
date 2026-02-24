import Chat from './components/Chat';
import ThemeSelector from './components/ThemeSelector';

export default function App() {
  return (
    <div className="flex h-[100dvh] flex-col divide-y dark:bg-teal-950 dark:caret-yellow-500">
      <header className="flex h-14 shrink-0 divide-x">
        <a
          className="flex aspect-square h-full items-center justify-center"
          href="/"
          title="Lame Local LLM"
        >
          <img src="/llllm.svg" className="w-8" alt="" />
        </a>
        <div className="hidden grow items-center justify-end gap-3 px-4 py-2 sm:flex"></div>
        <div className="flex items-center justify-center">
          <ThemeSelector />
        </div>
      </header>
      <section className="flex flex-1 overflow-hidden lg:divide-x">
        <div className="relative">
          <aside className="hidden h-full w-[300px] flex-col divide-y lg:flex">
            Menu here
          </aside>
        </div>
        <main className="flex flex-1 flex-col divide-y">
          <Chat />
        </main>
      </section>
    </div>
  );
}
