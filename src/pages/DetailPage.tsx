import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPokemonDetail } from "../api";
import { PokemonDetail } from "../types";
import { TypeBadge } from "../components/TypeBadge";

const STAT_LABELS: [keyof PokemonDetail["stats"], string][] = [
  ["hp", "HP"],
  ["attack", "Attack"],
  ["defense", "Defense"],
  ["spAttack", "Sp. Attack"],
  ["spDefense", "Sp. Defense"],
  ["speed", "Speed"],
];

export function DetailPage() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPokemon(null);
    setError(null);
    fetchPokemonDetail(Number(id))
      .then(setPokemon)
      .catch((err) => setError(err.message ?? "Failed to load"));
  }, [id]);

  if (error) {
    return (
      <div className="detail">
        <Link to="/" className="back-link">
          ← Back
        </Link>
        <p className="state-msg">Could not load Pokemon #{id}: {error}</p>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="detail">
        <Link to="/" className="back-link">
          ← Back
        </Link>
        <p className="state-msg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="detail">
      <Link to="/" className="back-link">
        ← Back
      </Link>

      <div className="detail-hero">
        <img src={pokemon.artwork} alt={pokemon.name} loading="lazy" />
        <div className="num">#{String(pokemon.id).padStart(3, "0")}</div>
        <h2>{pokemon.name}</h2>
        <div className="badges">
          {pokemon.type.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
        </div>
        <div className="names-row">
          <span>
            JP: <b>{pokemon.names.japanese}</b>
          </span>
          <span>
            FR: <b>{pokemon.names.french}</b>
          </span>
          <span>
            CN: <b>{pokemon.names.chinese}</b>
          </span>
        </div>
      </div>

      <div className="stats">
        {STAT_LABELS.map(([key, label]) => (
          <div className="stat-row" key={key}>
            <span>{label}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${Math.min(100, (pokemon.stats[key] / 180) * 100)}%` }}
              />
            </div>
            <span className="val">{pokemon.stats[key]}</span>
          </div>
        ))}
        <div className="stat-row total">
          <span>
            <b>Total</b>
          </span>
          <div />
          <span className="val">
            <b>{pokemon.stats.total}</b>
          </span>
        </div>
      </div>
    </div>
  );
}
