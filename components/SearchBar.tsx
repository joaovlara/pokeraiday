interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading?: boolean;
}

export function SearchBar({ value, onChange, onSearch, loading = false }: SearchBarProps) {
  return (
    <div className="flex gap-2 mb-6">
      <input
        className="border rounded px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        type="text"
        placeholder="Digite o nome do Pokémon"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        disabled={loading}
      />
      <button
        className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50 transition"
        onClick={onSearch}
        disabled={loading}
      >
        {loading ? "Buscando..." : "Buscar"}
      </button>
    </div>
  );
}
