import { SearchX } from "lucide-react";

import { useStaggerReveal } from "@/animation/libraryPageAnimation";
import { useLibrary } from "@/context/LibraryContext";
import BookCard from "./BookCard";
import CatalogToolbar from "./CatalogToolbar";

const CatalogPanel = ({ activeTab }) => {
  const { filteredBooks, books, query, genre, availability } = useLibrary();
  const isActive = activeTab === "catalog";

  // Re-staggers whenever the filter result changes, not on every render.
  useStaggerReveal(".book-card", [
    isActive,
    query,
    genre,
    availability,
    filteredBooks.length,
  ]);

  if (!isActive) return null;

  return (
    <section
      className="library-panel"
      id="panel-catalog"
      role="tabpanel"
      aria-labelledby="tab-catalog">
      <CatalogToolbar />

      <p className="results-note">
        Showing <strong>{filteredBooks.length}</strong> of{" "}
        <strong>{books.length}</strong> titles
      </p>

      {filteredBooks.length === 0 ?
        <div className="library-empty">
          <SearchX />
          <h3>No books match those filters</h3>
          <p>Try a different title, author, ISBN or clear the genre filter.</p>
        </div>
      : <div className="book-grid">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      }
    </section>
  );
};

export default CatalogPanel;
