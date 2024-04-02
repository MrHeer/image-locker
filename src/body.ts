import { useEffect } from 'react';

export function useInitBody(): void {
  useEffect(() => {
    const body = document.body;

    body.addEventListener('dragover', (event) => {
      body.classList.add('dragging');
      event.preventDefault();
    });

    body.addEventListener('drop', (event) => {
      body.classList.remove('dragging');
      event.preventDefault();
    });
  }, []);
}
