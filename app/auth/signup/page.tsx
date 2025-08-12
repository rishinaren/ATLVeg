"use client";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); return; }
    // Create profile row (client demo; production: server action)
    const user = data.user; if (user) {
      await fetch("/api/feedback", { method: "HEAD" }); // warm
      await fetch("/api/favorites", { method: "POST", body: JSON.stringify({ bootstrapProfile: true }) });
    }
    router.push("/");
  };

  return (
    <form onSubmit={onSubmit} className="card max-w-md mx-auto space-y-3">
      <h1 className="text-xl font-bold">Sign up</h1>
      <input className="chip w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="chip w-full" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <div className="text-red-600">{error}</div>}
      <button className="btn" type="submit">Create account</button>
    </form>
  );
}
