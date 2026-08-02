import Image from 'next/image';
import type {SupplementalAsset} from '@/content/assets';
import styles from './DetailGallery.module.css';

export function DetailGallery({assets}: {assets: SupplementalAsset[]}) {
  if (assets.length === 0) return null;

  return (
    <section className={styles.gallery} aria-label="Hardware detail views">
      {assets.map((asset) => (
        <figure className={styles.card} key={asset.id}>
          <div className={styles.imageFrame}>
            <Image
              src={asset.src}
              alt={asset.alt}
              width={asset.width}
              height={asset.height}
              sizes="(max-width: 767px) 92vw, (max-width: 1100px) 45vw, 34rem"
            />
          </div>
          <figcaption>
            <span className={styles.label}>{asset.label}</span>
            <span className={styles.caption}>{asset.caption}</span>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
