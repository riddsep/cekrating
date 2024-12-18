import { useEffect, useState } from "react";

export function useLocalStorage(key) {
  const [value, setValue] = useState(function () {
    const stored = JSON.parse(localStorage.getItem(key));
    return stored || [];
  });

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(value));
    },
    [value, key]
  );
  return [value, setValue];
}
