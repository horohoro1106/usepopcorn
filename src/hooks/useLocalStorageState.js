import { useEffect, useState } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}

/* const [watched, setWatched] = useState(function () {
    const storage = localStorage.getItem("watched");
    return JSON.parse(storage);
  });  */

/* useEffect(
     function () {
       localStorage.setItem("watched", JSON.stringify(watched));
     },
     [watched]
   ); */
