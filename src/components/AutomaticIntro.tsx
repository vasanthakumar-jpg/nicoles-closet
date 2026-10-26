import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { visualMedia } from '../data/sections';

export function AutomaticIntro({ complete }: { complete: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [needsPlay, setNeedsPlay] = useState(false);
  useEffect(() => {
    let active = true;
    const player = video.current;
    if (player) {
      player.muted = true;
      void player.play().catch(error => {
        if (active && error instanceof DOMException && error.name === 'NotAllowedError') setNeedsPlay(true);
      });
    }
    return () => { active = false; };
  }, []);

  async function play() {
    try { await video.current?.play(); setNeedsPlay(false); }
    catch { setNeedsPlay(true); }
  }

  return <motion.section className="intro-scene image-scene" aria-label="Door-opening video introduction" initial={false} exit={{ opacity: 0 }} transition={{ duration: .55 }}>
    <video ref={video} className="intro-video" src={visualMedia.introVideo} poster={visualMedia.intro} autoPlay muted playsInline preload="auto" onEnded={complete} onError={complete} onPlay={() => setNeedsPlay(false)} aria-label="Nicole and the girl opening the door"/>
    {needsPlay && <button className="intro-play minimal-control" aria-label="Play introduction" onClick={() => void play()}><Play size={24}/></button>}
    <button className="skip-intro minimal-control" onClick={complete}>Skip intro</button>
  </motion.section>;
}
