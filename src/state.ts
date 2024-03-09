import { BehaviorSubject, map } from "rxjs";

export const imageData$ = new BehaviorSubject<ImageData | null>(null);

export const showCanvas$ = imageData$.pipe(map((data) => data !== null));

export const imageState$ = new BehaviorSubject<
  null | "origin" | "gray" | "copied" | "compressed"
>(null);
