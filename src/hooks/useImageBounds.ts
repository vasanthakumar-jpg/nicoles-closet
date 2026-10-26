import { useLayoutEffect, useRef, useState } from 'react';
export function useImageBounds(aspectRatio: number) {
  const container = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const element = container.current;
    if (!element) return;
    const update = () => {
      const { width, height } = element.getBoundingClientRect();
      const imageWidth = Math.min(width, height * aspectRatio);
      setBounds({ width: imageWidth, height: imageWidth / aspectRatio });
    };
    update();
    const observer = new ResizeObserver(update); observer.observe(element);
    return () => observer.disconnect();
  }, [aspectRatio]);
  return { container, bounds };
}
