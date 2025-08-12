"use client";
import { useState } from "react";

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  return (
    <div className="space-y-3 max-w-xl">
      <h1 className="text-2xl font-bold">Feedback</h1>
      <textarea className="chip w-full min-h-[120px]" placeholder="Tell us what to improve…" value={message} onChange={e => setMessage(e.target.value)} />
      <button className="btn" onClick={async () => {
        await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
        setOk(true); setMessage("");
      }}>Send</button>
      {ok && <div className="text-green-600">Thanks! We read every note.</div>}
    </div>
  );
}
