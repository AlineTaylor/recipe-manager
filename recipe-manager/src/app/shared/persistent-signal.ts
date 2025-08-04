import { effect, signal, WritableSignal } from '@angular/core';

export function persistentSignal<T>(
  key: string,
  defaultValue: T
): WritableSignal<T> {
  // shouldn't conflict with auth service since keys are different!
  const stored = localStorage.getItem(key);
  const initial = stored ? JSON.parse(stored) : defaultValue;

  const s = signal<T>(initial);

  effect(() => {
    localStorage.setItem(key, JSON.stringify(s()));
  });

  return s;
}
