import {BreadcrumbItem, Breadcrumbs} from '@astryxdesign/core/Breadcrumbs';

export interface BreadcrumbEntry {
  label: string;
  href?: string;
}

export function PageBreadcrumbs({items}: {items: BreadcrumbEntry[]}) {
  return (
    <Breadcrumbs variant="supporting">
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1;
        return (
          <BreadcrumbItem
            key={`${item.label}-${index}`}
            href={isCurrent ? undefined : item.href}
            isCurrent={isCurrent}
          >
            {item.label}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumbs>
  );
}
