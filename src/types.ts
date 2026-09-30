export interface PokemonSummary {
  id: number;
  name: string;
  type: string[];
  sprite: string;
}

export interface PokemonDetail extends PokemonSummary {
  names: {
    english: string;
    japanese: string;
    chinese: string;
    french: string;
  };
  stats: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
    total: number;
  };
  artwork: string;
}

export interface ListResponse {
  data: PokemonSummary[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
