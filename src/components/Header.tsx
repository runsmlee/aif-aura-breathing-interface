export function Header() {
  return (
    <header className="flex items-center justify-center py-4 sm:py-6">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
        <h1 className="text-lg sm:text-xl font-medium tracking-wide text-white">
          Aura
        </h1>
      </div>
    </header>
  );
}
