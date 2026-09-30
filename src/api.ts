import { ListResponse, PokemonDetail } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function fetchPokemonList(params: {
  q?: string;
  type?: string;
  page?: number;
  limit?: number;
}): Promise<ListResponse> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.type) search.set("type", params.type);
  search.set("page", String(params.page ?? 1));
  search.set("limit", String(params.limit ?? 24));

  const res = await fetch(`${API_URL}/api/pokemon?${search.toString()}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchPokemonDetail(id: number): Promise<PokemonDetail> {
  const res = await fetch(`${API_URL}/api/pokemon/${id}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchTypes(): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/pokemon/types`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.data;
}
