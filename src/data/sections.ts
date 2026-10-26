// Exact uploaded originals; no generated or modified reference images.
export const visualMedia = {
  intro: '/media/founder.jpeg',
  introVideo: '/media/Woman_and_girl_opening_door_20261024114408.mp4',
  home: '/media/Nicole’s Fashion Empire Atrium.png',
};
export type VisualSection = {
  id: string; name: string;
  bounds: [number, number, number, number]; // image-relative [left, top, width, height] %
  marker: [number, number];
  media: { type: 'image' | 'video'; src: string; poster?: string; focus?: [number, number, number, number] };
};
export const sections: VisualSection[] = [
  { id: 'it-division', name: 'IT Division', bounds: [10, 4, 38, 28], marker: [29, 11], media: { type: 'image', src: visualMedia.home, focus: [9, 2, 40, 32] } },
  { id: 'design-section', name: 'Design Section', bounds: [50, 3, 48, 29], marker: [72, 10], media: { type: 'image', src: visualMedia.home, focus: [50, 2, 48, 32] } },
  { id: 'jack-duke', name: 'Jack Duke', bounds: [1, 35, 18, 47], marker: [10, 40], media: { type: 'image', src: visualMedia.home, focus: [0, 34, 20, 49] } },
  { id: 'cl-california', name: 'CL California', bounds: [19, 42, 21, 41], marker: [28, 47], media: { type: 'image', src: visualMedia.home, focus: [18, 40, 23, 44] } },
  { id: 'nicoles-closet', name: 'Nicole’s Closet', bounds: [40, 43, 16, 39], marker: [49, 47], media: { type: 'image', src: visualMedia.home, focus: [37, 42, 20, 44] } },
  { id: 'nicole-duke', name: 'Nicole Duke', bounds: [56, 43, 14, 39], marker: [63, 47], media: { type: 'image', src: visualMedia.home, focus: [55, 42, 16, 42] } },
  { id: 'just-nikki', name: 'Just Nikki', bounds: [70, 42, 14, 41], marker: [77, 47], media: { type: 'video', src: '/media/JustNikki.mp4' } },
  { id: 'nicoles-place', name: 'Nicole’s Place', bounds: [84, 42, 16, 43], marker: [92, 47], media: { type: 'image', src: visualMedia.home, focus: [83, 41, 17, 45] } },
];
