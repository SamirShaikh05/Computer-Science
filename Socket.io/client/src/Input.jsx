export default function Input({ name, placeholder, onChange }) {
  return (
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      onChange={(e) =>
        onChange({
          name,
          score: e.target.value,
        })
      }
      className="w-64 px-4 py-2 bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  );
}