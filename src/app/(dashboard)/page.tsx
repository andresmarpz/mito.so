export default function DashboardPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-8">
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
            mito
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-[42rem] mx-auto">
            Your second brain, reimagined.
          </p>
        </div>
      </div>
    </main>
  );
}
