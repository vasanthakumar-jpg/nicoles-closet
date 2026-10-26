import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import type { VisualSection } from '../data/sections';
import { useImageBounds } from '../hooks/useImageBounds';
export function VisualChapter({ section, back }: { section: VisualSection; back: () => void }) {
  const focus = section.media.focus;
  const aspectRatio = focus ? (1672 * focus[2]) / (941 * focus[3]) : 16 / 9;
  const { container, bounds } = useImageBounds(aspectRatio);
  return <motion.section className="chapter-image-scene image-scene" aria-label={`${section.name} visual chapter`} initial={{ opacity: 0, scale: 1.035 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .985 }} transition={{ duration: .6, ease: [.2, .6, .3, 1] }}>
    {section.media.type === 'video' ? <video className="chapter-video" src={section.media.src} poster={section.media.poster} autoPlay muted controls playsInline preload="auto" aria-label={`${section.name} video`}/> : focus ? <div className="image-stage" ref={container}><div className="chapter-crop-bounds" style={bounds}><img className="chapter-crop-image" src={section.media.src} alt={section.name} style={{ width: `${10000 / focus[2]}%`, height: `${10000 / focus[3]}%`, left: `${-focus[0] / focus[2] * 100}%`, top: `${-focus[1] / focus[3] * 100}%` }}/></div></div> : <img className="full-chapter-image" src={section.media.src} alt={section.name}/>}
    <button className="back-control minimal-control" onClick={back} aria-label="Back to atrium"><ArrowLeft size={18}/><span>Back</span></button>
  </motion.section>;
}
