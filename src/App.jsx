import { useEffect, useState } from "react";
import { Loader } from "./components/Loader";
import { ErrorMessage } from "./components/ErrorMessage";
import { NavBar } from "./components/NavBar";
import { Search } from "./components/Search";
import { NumResults } from "./components/NumResults";
import { Main } from "./components/Main";
import { Box } from "./components/Box";
import { MovieList } from "./components/MovieList";
import { MoviesDetails } from "./components/MoviesDetails";
import { WatchedSummary } from "./components/WatchedSummary";
import { WatchedMoviesList } from "./components/WatchedMoviesList";

export const API_KEY = "23d8456";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched((movie) => movie.filter((movie) => movie.imdbID !== id));
  }

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Something went wrong to fetching data");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not Found");

        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();
    return function () {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <NavBar>
        <Search setQuery={setQuery} query={query} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage error={error} />
          ) : (
            <MovieList movies={movies} onSelected={handleSelectMovie} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MoviesDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteMovie={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
