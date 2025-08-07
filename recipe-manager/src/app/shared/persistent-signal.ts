import {
  signal,
  WritableSignal,
  effect,
  inject,
  runInInjectionContext,
  EnvironmentInjector,
} from '@angular/core';

export function persistentSignal<T>(
  key: string,
  defaultValue: T
): WritableSignal<T> {
  const stored = localStorage.getItem(key);
  const initial = stored ? JSON.parse(stored) : defaultValue;

  const s = signal<T>(initial);

  // 👇 This is the important part: wrap effect in injection context
  runInInjectionContext(inject(EnvironmentInjector), () => {
    effect(() => {
      localStorage.setItem(key, JSON.stringify(s()));
    });
  });

  return s;
}
