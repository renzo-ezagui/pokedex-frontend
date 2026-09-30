import { typeColor } from "../typeColors";

export function TypeBadge({ type }: { type: string }) {
  return (
    <span className="badge" style={{ background: typeColor(type) }}>
      {type}
    </span>
  );
}
