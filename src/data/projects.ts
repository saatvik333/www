export interface Project {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
}

export const projects: Project[] = [
  {
    slug: 'tabula',
    title: 'tabula',
    description: 'a minimal, aesthetic new tab extension',
    tags: ['browser', 'extension', 'typescript'],
  },
  {
    slug: 'dotfiles',
    title: 'dotfiles',
    description: 'my niri/wayland linux configuration',
    tags: ['linux', 'wayland', 'rice'],
  },
  {
    slug: 'bongocat',
    title: 'wayland-bongocat',
    description: 'a bongo cat overlay for wayland',
    tags: ['rust', 'wayland', 'linux'],
  },
  {
    slug: 'sddm-theme',
    title: 'sddm-theme',
    description: 'a minimal sddm login theme',
    tags: ['qml', 'linux', 'theme'],
  },
  {
    slug: 'portfolio',
    title: 'portfolio',
    description: 'this website you are looking at',
    tags: ['nextjs', 'typescript', 'web'],
  },
  {
    slug: 'awww-switcher',
    title: 'awww-switcher',
    description: 'wallpaper switcher vicinae extension',
    tags: ['typescript', 'extension'],
  },
];
