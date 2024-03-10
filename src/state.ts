import { BehaviorSubject, map } from "rxjs";

export const imageData$ = new BehaviorSubject<ImageData | null>(null);

export const showCanvas$ = imageData$.pipe(
  map((imageData) => imageData !== null),
);

export const actionDisabeled$ = imageData$.pipe(
  map((imageData) => imageData === null),
);
