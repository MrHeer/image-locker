import { useEffect } from "react";

export const useInitBody = () => {
  useEffect(() => {
    const body = document.body;

    body.addEventListener("dragover", (event) => {
      body.classList.add("dragging");
      event.preventDefault();
    });

    body.addEventListener("drop", (event) => {
      body.classList.remove("dragging");
      event.preventDefault();
    });
  }, []);
};
