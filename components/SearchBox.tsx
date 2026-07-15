export default function SearchBox({
  defaultValue,
  placeholder = "Search a symptom, e.g. Fatigue",
}: {
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <form action="/" className="flex gap-2 w-full">
      <input
        type="text"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoFocus
        autoComplete="off"
        autoCapitalize="none"
        inputMode="search"
        className="flex-1 min-w-0 rounded-lg border border-neutral-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="submit"
        className="shrink-0 touch-manipulation rounded-lg bg-emerald-700 text-white px-5 py-3 font-medium hover:bg-emerald-800 active:bg-emerald-900 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
