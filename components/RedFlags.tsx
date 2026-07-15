export default function RedFlags({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-4">
      <p className="font-semibold text-red-800 text-sm mb-1">
        ⚠ Seek medical attention if:
      </p>
      <p className="text-red-800 text-sm">{text}</p>
    </div>
  );
}
