import { useState } from "react";
import { NumResults } from "./components/NumResults/NumResults";
import { Search } from "./components/Search/Search";
import { NavBar } from "./components/NavBar/NavBar";
import { Loader } from "./components/Loader/Loader";
import { Main } from "./components/Main/Main";
import { ErrorMessage } from "./components/ErrorMessage/ErrorMessage";
import { Box } from "./components/Box/Box";
import { MovieDetails } from "./components/MovieDetails/MovieDetails";
import { MovieList } from "./components/MovieList/MovieList";
import { WatchedSummary } from "./components/WatchedSummary/WatchedSummary";
import { WatchedMoviesList } from "./components/WatchedMoviesList/WatchedMoviesList";
import { useMovies } from "./hooks/useMovies";
import { useLocalStorageState } from "./hooks/useLocalStorageState";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = "b303b02b";

export default function App() {
  const [query, setQuery] = useState("inception");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  /* const [watched, setWatched] = useState([]); */
  /*  const [watched, setWatched] = useState(function () {
    const storage = localStorage.getItem("watched");
    return JSON.parse(storage);
  }); */

  /*  useEffect(function () {
    fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`)
      .then((res) => res.json())
      .then((data) => setMovies(data.Search));
  }, []); */

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    /* localStorage.setItem("watched", JSON.stringify([...watched, movie])); */
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
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
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
