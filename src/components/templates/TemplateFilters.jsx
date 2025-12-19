export default function TemplateFilters({
  search,
  setSearch,
  area,
  setArea,
  difficulty,
  setDifficulty,
  sortBy,
  setSortBy,
  showFavouritesOnly,
  setShowFavouritesOnly,
  areas = [],
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm md:flex-row md:items-end md:justify-between">
      <div className="flex flex-1 flex-wrap gap-3">
        <label className="flex-1 min-w-[200px] text-sm text-slate-800">
          Search
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>

        <label className="min-w-[180px] text-sm text-slate-800">
          Area
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="all">All</option>
            {areas.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="min-w-[180px] text-sm text-slate-800">
          Difficulty
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="all">All</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>

        <label className="min-w-[180px] text-sm text-slate-800">
          Sort
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="usefulness">Most useful</option>
            <option value="newest">Newest</option>
            <option value="time">Shortest time</option>
          </select>
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <input
          type="checkbox"
          checked={showFavouritesOnly}
          onChange={(e) => setShowFavouritesOnly(e.target.checked)}
        />
        Favourites only
      </label>
    </div>
  );
}
