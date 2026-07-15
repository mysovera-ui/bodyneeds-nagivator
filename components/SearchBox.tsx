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
        className="flex-1 rounded-lg border border-neutral-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="submit"
        className="rounded-lg bg-emerald-700 text-white px-5 py-3 font-medium hover:bg-emerald-800 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
