import { LIBRARY } from '@/lib/site';

/** The four release facts. Every value is derived from canonical data. */
export function releaseFacts(): Array<{ label: string; value: string }> {
  return [
    { label: 'Icons in V2', value: String(LIBRARY.iconCount) },
    { label: 'Categories', value: String(LIBRARY.categoryCount) },
    { label: 'Base grid', value: '24px' },
    { label: 'Licence', value: 'MIT' },
  ];
}

export function ReleaseStats() {
  return (
    <section className="shell" aria-label="Release facts">
      <dl className="proof">
        {releaseFacts().map((fact) => (
          <div className="proof__cell" key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
