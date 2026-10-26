import { useEffect, useRef } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { AutomaticIntro } from './components/AutomaticIntro';
import { AtriumScene } from './components/AtriumScene';
import { VisualChapter } from './components/VisualChapter';
import { useVisualScene } from './hooks/useVisualScene';
import { sections } from './data/sections';

export default function App() {
  const { scene, go } = useVisualScene();
  const main = useRef<HTMLElement>(null);
  const lastSection = useRef<string | null>(null);
  const section = sections.find(item => scene === `section/${item.id}`);
  useEffect(() => {
    document.title = `${section ? `${section.name} — ` : ''}Nicole’s Closet`;
    const timer = setTimeout(() => {
      if (scene === 'home' && lastSection.current) {
        main.current?.querySelector<HTMLButtonElement>(`[data-section="${lastSection.current}"]`)?.focus({ preventScroll: true });
      } else main.current?.focus({ preventScroll: true });
      if (section) lastSection.current = section.id;
    }, 650);
    return () => clearTimeout(timer);
  }, [scene, section]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape' && scene !== 'home') go('home', scene === 'intro'); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [scene, go]);
  return <MotionConfig reducedMotion="user"><main ref={main} className="visual-experience" tabIndex={-1} aria-label="Nicole’s Closet interactive image experience">
    <AnimatePresence mode="wait">
      {scene === 'intro' ? <AutomaticIntro key="intro" complete={() => go('home', true)}/> :
        section ? <VisualChapter key={section.id} section={section} back={() => go('home')}/> :
        <AtriumScene key="home" open={id => go(`section/${id}`)}/>}
    </AnimatePresence>
  </main></MotionConfig>;
}

