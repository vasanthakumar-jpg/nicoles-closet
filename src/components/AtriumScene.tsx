import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { CSSProperties } from 'react';
import { sections, visualMedia } from '../data/sections';
import { useImageBounds } from '../hooks/useImageBounds';
export function AtriumScene({ open }: { open: (id: string) => void }) {
  const [ratio, setRatio] = useState(1672 / 941);
  const { container, bounds } = useImageBounds(ratio);
  const [selected, setSelected] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reduced = useReducedMotion();
  useEffect(() => () => clearTimeout(timer.current), []);
  const selectedSection = sections.find(section => section.id === selected);
  function choose(id: string) {
    if (timer.current) return;
    setSelected(id); timer.current = setTimeout(() => open(id), reduced ? 0 : 480);
  }
  return <motion.section className="atrium-scene image-scene" aria-label="Interactive Nicole’s Closet atrium" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .7 }}>
    <div className="image-stage" ref={container}><motion.div className="atrium-image-bounds" style={{ ...bounds, transformOrigin: selectedSection ? `${selectedSection.marker[0]}% ${selectedSection.marker[1]}%` : '50% 50%' }} animate={{ scale: selected && !reduced ? 1.09 : 1 }} transition={{ duration: .55, ease: [.2, .65, .3, 1] }}>
      <img className="source-image atrium-source" src={visualMedia.home} alt="Nicole’s fashion empire atrium: IT and design upstairs; Jack Duke, CL California, Nicole’s Closet, Nicole Duke, Just Nikki, and Nicole’s Place below" onLoad={event => setRatio(event.currentTarget.naturalWidth / event.currentTarget.naturalHeight)}/>
      {sections.map(section => {
        const [left, top, width, height] = section.bounds;
        return <button key={section.id} data-section={section.id} className={`image-hotspot ${selected === section.id ? 'selected' : ''}`} aria-label={`Open ${section.name}`} disabled={selected !== null} onClick={() => choose(section.id)} style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%`, '--marker-x': `${(section.marker[0] - left) / width * 100}%`, '--marker-y': `${(section.marker[1] - top) / height * 100}%` } as CSSProperties}><span className="hotspot-indicator" aria-hidden="true"><span/></span></button>;
      })}
    </motion.div></div>
  </motion.section>;
}
