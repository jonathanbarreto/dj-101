import {Link} from '@astryxdesign/core/Link';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {PageFrame} from './PageFrame';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <PageFrame>
        <Stack direction="vertical" gap={3} xstyle={undefined}>
          <Stack direction="horizontal" gap={3} wrap="wrap" as="nav" aria-label="Footer">
            <Link href="/controller" isStandalone>Controller</Link>
            <Link href="/rekordbox" isStandalone>rekordbox 7</Link>
            <Link href="/reference/beat-fx" isStandalone>Reference</Link>
          </Stack>
          <Text type="supporting" className={styles.legal}>
            Product images © AlphaTheta Corporation / Pioneer DJ, used for educational
            identification. Pioneer DJ and DDJ-1000 are trademarks of AlphaTheta Corporation.
            This site is not affiliated with or endorsed by AlphaTheta.
          </Text>
          <Text type="supporting" weight="semibold">
            rekordbox 7 Performance mode only
          </Text>
        </Stack>
      </PageFrame>
    </footer>
  );
}
