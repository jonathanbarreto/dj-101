'use client';

import {AppShell} from '@astryxdesign/core/AppShell';
import {TopNav, TopNavHeading, TopNavItem} from '@astryxdesign/core/TopNav';
import {usePathname} from 'next/navigation';
import {SiteFooter} from './SiteFooter';

const NAV_ITEMS = [
  {label: 'Learn the gear', href: '/gear'},
  {label: 'Mixing Tutorials', href: '/mixing-tutorials'},
  {label: 'Reference', href: '/reference'},
] as const;

export function isRouteActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteShell({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS.map((item) => (
    <TopNavItem
      key={item.href}
      label={item.label}
      href={item.href}
      isSelected={isRouteActive(pathname, item.href)}
    />
  ));

  return (
    <>
      <AppShell
        height="auto"
        variant="section"
        contentPadding={0}
        mobileNav={{breakpoint: 'md'}}
        topNav={(
          <TopNav
            label="Primary navigation"
            heading={<TopNavHeading heading="Mixed" headingHref="/" />}
            startContent={navItems}
          />
        )}
      >
        {children}
      </AppShell>
      <SiteFooter />
    </>
  );
}
