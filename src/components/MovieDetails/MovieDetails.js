import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { StarRating } from "../StarRating/StarRating";
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { KEY } from "../../App";
import { useKey } from "../../hooks/useKey";

export function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState("");
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  const countRef = useRef(0);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(() => {
    if (userRating) countRef.current += 1;
  }, [userRating]);

  useEffect(
    function () {
      (async function getMovieDetails() {
        try {
          setIsLoading(true);
          setError("");
          const res = await axios.get(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );
          if (res.data.Error) {
            throw new Error(res.data.Error);
          }
          setMovie(res?.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      })();
    },
    [selectedId]
  );

  useEffect(
    function () {
      document.title = `MOVIE | ${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  useKey("Escape", onCloseMovie);

  /* useEffect(
    function () {
      function closingCallback(e) {
        if (e.code === "Escape") onCloseMovie();
        console.log("Closed");
      }

      document.addEventListener("keydown", closingCallback);

      return function () {
        document.removeEventListener("keydown", closingCallback);
      };
    },
    [onCloseMovie]
  ); */

  return (
    <div className="details">
      {isLoading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMDB rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You have rated this movie with {watchedUserRating} ⭐</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
