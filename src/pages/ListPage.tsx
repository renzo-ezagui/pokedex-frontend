import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchPokemonList, fetchTypes } from "../api";
import { PokemonSummary } from "../types";
import { TypeBadge } from "../components/TypeBadge";

const LIMIT = 24;

export function ListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const [items, setItems] = useState<PokemonSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTypes().then(setTypes).catch(() => setTypes([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPokemonList({ q, type, page, limit: LIMIT })
      .then((res) => {
        if (cancelled) return;
        setItems(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [q, type, page]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  }

  function goToPage(p: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <header className="app-header">
        <h1>
          <span className="ball" />
          Pokedex
        </h1>
        <p>{total ? `${total} Pokemon` : " "}</p>
      </header>

      <div className="controls">
        <input
          type="search"
          placeholder="Search by name..."
          defaultValue={q}
          onChange={(e) => updateParam("q", e.target.value)}
        />
        <select value={type} onChange={(e) => updateParam("type", e.target.value)}>
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="state-msg">Could not reach the API: {error}</p>}
      {!error && loading && <p className="state-msg">Loading...</p>}
      {!error && !loading && items.length === 0 && (
        <p className="state-msg">No Pokemon match that search.</p>
      )}

      {!error && !loading && items.length > 0 && (
        <>
          <div className="grid">
            {items.map((p) => (
              <Link key={p.id} to={`/pokemon/${p.id}`} className="card">
                <img src={p.sprite} alt={p.name} loading="lazy" />
                <div className="num">#{String(p.id).padStart(3, "0")}</div>
                <div className="name">{p.name}</div>
                <div className="badges">
                  {p.type.map((t) => (
                    <TypeBadge key={t} type={t} />
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="pagination">
            <button disabled={page <= 1} onClick={() => goToPage(page - 1)}>
              ← Prev
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
              Next →
            </button>
          </div>
        </>
      )}
    </>
  );
}
