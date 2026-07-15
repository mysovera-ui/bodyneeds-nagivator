import Link from "next/link";

const links = [
  { href: "/symptoms", label: "Symptoms" },
  { href: "/nutrients", label: "Nutrients" },
  { href: "/foods", label: "Foods" },
  { href: "/supplements", label: "Supplements" },
];

export default function Nav() {
  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold text-lg tracking-tight text-emerald-700">
          BodyNeeds Navigator
        </Link>
        <nav className="flex gap-4 text-sm overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-neutral-600 hover:text-emerald-700 whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
