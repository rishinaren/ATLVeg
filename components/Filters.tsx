"use client";
import { useState } from "react";

export type Filters = {
  maxKm: number;
  minRating: number; // 0-5
  price?: string;    // 0-4
  cuisine?: string;  // slug
};

export function FiltersBar({ onApply }: { onApply: (f: Filters) => void }) {
  const [state, setState] = useState<Filters>({ maxKm: 20, minRating: 0 });
  return (
    <div className="card flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-sm">Max distance (km)</label>
        <input type="number" value={state.maxKm} onChange={e => setState({ ...state, maxKm: +e.target.value })} className="chip" />
      </div>
      <div>
        <label className="block text-sm">Min rating</label>
        <input type="number" step="0.1" min={0} max={5} value={state.minRating} onChange={e => setState({ ...state, minRating: +e.target.value })} className="chip" />
      </div>
      <div>
        <label className="block text-sm">Price level</label>
        <select value={state.price ?? ''} onChange={e => setState({ ...state, price: e.target.value || undefined })} className="chip">
          <option value="">Any</option>
          <option value="0">Free</option>
          <option value="1">$</option>
          <option value="2">$$</option>
          <option value="3">$$$</option>
          <option value="4">$$$$</option>
        </select>
      </div>
      <div>
        <label className="block text-sm">Cuisine</label>
        <input placeholder="indian, thai…" value={state.cuisine ?? ''} onChange={e => setState({ ...state, cuisine: e.target.value || undefined })} className="chip" />
      </div>
      <button onClick={() => onApply(state)} className="btn">Apply filters</button>
    </div>
  );
}
