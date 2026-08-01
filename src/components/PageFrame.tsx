import {Layout, LayoutContent} from '@astryxdesign/core/Layout';
import styles from './PageFrame.module.css';

interface PageFrameProps {
  children: React.ReactNode;
  role?: React.AriaRole;
}

export function PageFrame({children, role}: PageFrameProps) {
  return (
    <Layout
      height="auto"
      contentWidth="1440px"
      content={(
        <LayoutContent isScrollable={false} role={role} padding={0}>
          <div
            className={styles.frame}
            data-testid="page-frame"
            data-layout-height="auto"
          >
            {children}
          </div>
        </LayoutContent>
      )}
    />
  );
}
