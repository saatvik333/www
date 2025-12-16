export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-minimal-startpage',
    title: 'building a minimal startpage',
    description: 'creating a clean and functional browser new tab page',
    date: '2024-12-15',
  },
  {
    slug: 'wayland-development',
    title: 'wayland development in rust',
    description: 'lessons learned building wayland applications',
    date: '2024-11-20',
  },
  {
    slug: 'linux-rice-guide',
    title: 'linux ricing guide',
    description: 'a comprehensive guide to customizing your linux desktop',
    date: '2024-10-05',
  },
  {
    slug: 'nextjs-portfolio',
    title: 'building a portfolio with next.js',
    description: 'design decisions and implementation details',
    date: '2024-09-12',
  },
  // Dummy posts for scroll testing
  {
    slug: 'typescript-patterns',
    title: 'advanced typescript patterns',
    description: 'exploring generics, conditional types, and mapped types',
    date: '2024-08-25',
  },
  {
    slug: 'dotfiles-management',
    title: 'managing dotfiles with git',
    description: 'how to version control your configuration files',
    date: '2024-08-10',
  },
  {
    slug: 'neovim-setup',
    title: 'my neovim setup 2024',
    description: 'plugins, keymaps, and configuration for productivity',
    date: '2024-07-22',
  },
  {
    slug: 'rust-async',
    title: 'async rust demystified',
    description: 'understanding futures, tokio, and async/await',
    date: '2024-07-05',
  },
  {
    slug: 'css-grid-layouts',
    title: 'mastering css grid',
    description: 'building complex layouts with css grid',
    date: '2024-06-18',
  },
  {
    slug: 'terminal-customization',
    title: 'terminal emulator showdown',
    description: 'comparing alacritty, kitty, and wezterm',
    date: '2024-06-01',
  },
  {
    slug: 'git-workflow',
    title: 'git workflow for solo developers',
    description: 'branches, commits, and automation strategies',
    date: '2024-05-15',
  },
  {
    slug: 'svg-animations',
    title: 'creating svg animations',
    description: 'animate svg paths with css and javascript',
    date: '2024-05-02',
  },
  {
    slug: 'system-fonts',
    title: 'system fonts vs web fonts',
    description: 'performance and aesthetics trade-offs',
    date: '2024-04-20',
  },
  {
    slug: 'minimalist-design',
    title: 'principles of minimalist design',
    description: 'less is more in web interfaces',
    date: '2024-04-05',
  },
  {
    slug: 'keyboard-driven',
    title: 'keyboard-driven workflow',
    description: 'ditch the mouse for maximum efficiency',
    date: '2024-03-22',
  },
  {
    slug: 'color-theory',
    title: 'color theory for developers',
    description: 'choosing palettes that work',
    date: '2024-03-10',
  },
];
