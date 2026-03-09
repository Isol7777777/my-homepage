import { LogIn } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b-4 border-foreground">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg border-2 border-foreground hover:scale-105 transition-transform">
          <LogIn className="w-5 h-5" />
          <span>Login</span>
        </button>
      </div>
    </header>
  );
}
