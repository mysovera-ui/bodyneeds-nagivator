import type { FieldConfig } from "@/lib/admin";

export default function AdminFormFields({
  fields,
  defaultValues,
}: {
  fields: FieldConfig[];
  defaultValues?: Record<string, unknown>;
}) {
  return (
    <>
      {fields.map((f) => {
        const raw = defaultValues?.[f.name];
        const value = typeof raw === "string" ? raw : raw == null ? "" : String(raw);
        return (
          <div key={f.name}>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              {f.label}
              {f.required && <span className="text-red-600"> *</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea
                name={f.name}
                required={f.required}
                defaultValue={value}
                rows={3}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            ) : f.type === "select" ? (
              <select
                name={f.name}
                required={f.required}
                defaultValue={value || f.options?.[0] || ""}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-base"
              >
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name={f.name}
                required={f.required}
                defaultValue={value}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            )}
          </div>
        );
      })}
    </>
  );
}
