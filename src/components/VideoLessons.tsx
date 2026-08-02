import type {TutorialVideo} from '@/content/videos';
import styles from './VideoLessons.module.css';

export function VideoLessons({videos}: {videos: TutorialVideo[]}) {
  if (videos.length === 0) return null;

  return (
    <section className={styles.section} aria-label="Tutorial videos">
      <span className={styles.heading}>Watch it in motion</span>
      <div className={styles.grid}>
        {videos.map((video) => (
          <article className={styles.card} key={video.id}>
            <video
              className={styles.video}
              controls
              preload="metadata"
              playsInline
              aria-label={`Tutorial: ${video.title}`}
            >
              <source src={video.src} type="video/mp4" />
              Your browser does not support embedded video.
            </video>
            <div className={styles.copy}>
              <span className={styles.title}>{video.title}</span>
              <span className={styles.description}>{video.description}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
