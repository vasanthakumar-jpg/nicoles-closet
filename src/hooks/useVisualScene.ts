import { useCallback, useEffect, useState } from 'react';
import { sections } from '../data/sections';
export type VisualScene = 'intro' | 'home' | `section/${string}`;
function readScene(): VisualScene {
  const hash = window.location.hash.slice(1);
  if (hash === 'home' || hash === 'palace') return 'home';
  if (hash.startsWith('section/') && sections.some(section => section.id === hash.slice(8))) return hash as VisualScene;
  return 'intro';
}
export function useVisualScene() {
  const [scene, setScene] = useState<VisualScene>(readScene);
  useEffect(() => {
    const sync = () => setScene(readScene());
    window.addEventListener('popstate', sync); window.addEventListener('hashchange', sync);
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('hashchange', sync); };
  }, []);
  const go = useCallback((next: VisualScene, replace = false) => {
    if (readScene() === next) return;
    window.history[replace ? 'replaceState' : 'pushState']({ scene: next }, '', `#${next}`);
    setScene(next);
  }, []);
  return { scene, go };
}
