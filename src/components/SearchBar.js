export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-box">
      <label className="visually-hidden" htmlFor="search-input">
        Search posts
      </label>
      <input
        id="search-input"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
}
