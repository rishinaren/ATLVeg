import "@/styles/globals.css";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <main className="container py-6">{children}</main>
      </body>
    </html>
  );
}
