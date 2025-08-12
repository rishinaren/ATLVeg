"use client";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); return; }
    router.push("/");
  };

  return (
    <form onSubmit={onSubmit} className="card max-w-md mx-auto space-y-3">
      <h1 className="text-xl font-bold">Login</h1>
      <input className="chip w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="chip w-full" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <div className="text-red-600">{error}</div>}
      <button className="btn" type="submit">Sign in</button>
      <a href="/auth/signup" className="underline text-sm">Create an account</a>
    </form>
  );
}
