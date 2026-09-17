import { Search } from "lucide-react";

import { availabilityOptions } from "@/assets/data/libraryAssets";
import { useLibrary } from "@/context/LibraryContext";

const CatalogToolbar = () => {
  const {
    query,
    setQuery,
    genre,
    setGenre,
    availability,
    setAvailability,
    genres,
  } = useLibrary();

  return (
    <div className="library-toolbar">
      <div className="search-field search-field--sm">
        <Search />
        <input
          type="text"
          placeholder="Search title, author, ISBN or genre"
          aria-label="Search the catalog"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <select
        className="select-field"
        id="genreFilter"
        aria-label="Filter by genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}>
        <option value="">All genres</option>
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
      <select
        className="select-field"
        id="availabilityFilter"
        aria-label="Filter by availability"
        value={availability}
        onChange={(e) => setAvailability(e.target.value)}>
        {availabilityOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CatalogToolbar;
