import { releaseFacts } from '@/lib/compositions';
import { LIBRARY } from '@/lib/site';

export function ReleaseStats() {
  return (
    <section className="shell" aria-label="Release facts">
      <dl className="proof">
        {releaseFacts(LIBRARY.iconCount, LIBRARY.categoryCount).map((fact) => (
          <div className="proof__cell" key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
