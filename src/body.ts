export const body = document.body;

export const setupBody = () => {
  body.addEventListener("dragover", (event) => {
    body.classList.add("dragging");
    event.preventDefault();
  });

  body.addEventListener("drop", (event) => {
    body.classList.remove("dragging");
    event.preventDefault();
  });
};
