export interface NavLinkItem {
  href: string;
  label: string;
}

export const navLinks: NavLinkItem[] = [
  { href: '/about', label: 'about' },
  { href: '/projects', label: 'projects' },
  { href: '/blog', label: 'blogs' },
  { href: '/pics', label: 'pics' },
  { href: '/contact', label: 'contact' },
];
