"use client";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();
  const Tab = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} className={`px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 ${path===href?"font-semibold underline":""}`}>{label}</Link>
  );
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 bg-white/70 dark:bg-gray-950/70 backdrop-blur">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="text-xl font-bold">ATLVeg</Link>
        <nav className="flex items-center gap-2">
          <Tab href="/about" label="About" />
          <Tab href="/favorites" label="Favorites" />
          <Tab href="/history" label="History" />
          <Tab href="/feedback" label="Feedback" />
          <Tab href="/auth/login" label="Login" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
