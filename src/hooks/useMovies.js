import { useEffect, useState } from "react";
import axios from "axios";

export const KEY = "b303b02b";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  callback?.();

  useEffect(
    function () {
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      const controller = new AbortController();
      (async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await axios.get(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (res.data.Error) {
            throw new Error(res.data.Error);
          }
          setMovies(res?.data?.Search);
          setError("");
        } catch (err) {
          if (err.name !== "CanceledError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      })();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, error, isLoading };
}
