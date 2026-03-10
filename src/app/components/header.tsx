import Link from "next/link";
import { LogIn, UserCircle } from "lucide-react";

interface HeaderProps {
  isAdmin: boolean;
}

export function Header({ isAdmin }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b-4 border-foreground">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-end">
        {isAdmin ? (
          <Link
            href="/admin"
            className="flex items-center gap-2 px-6 py-2 rounded-lg border-2 border-foreground
              text-primary-foreground bg-primary shadow-xl hover:shadow-2xl
              hover:scale-105 transition-transform"
          >
            <UserCircle className="w-5 h-5" />
            <span>Admin Mode</span>
          </Link>
        ) : (
          <Link
            href="/admin/login"
            className="flex items-center gap-2 px-6 py-2 rounded-lg border-2 border-foreground
              text-foreground shadow-xl hover:shadow-2xl
              hover:scale-105 transition-transform"
          >
            <LogIn className="w-5 h-5" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </header>
  );
}
