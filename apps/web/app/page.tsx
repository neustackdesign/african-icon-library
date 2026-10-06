import type { Metadata } from 'next';

import { LibraryBrowser } from '@/components/LibraryBrowser';
import { CategoryIndex } from '@/components/landing/CategoryIndex';
import { ContextSection } from '@/components/landing/ContextSection';
import { DistributionTree } from '@/components/landing/DistributionTree';
import { Hero } from '@/components/landing/Hero';
import { IconRibbon } from '@/components/landing/IconRibbon';
import { MapsSection } from '@/components/landing/MapsSection';
import { LibraryProvider } from '@/components/landing/LibraryProvider';
import { OpenSourceSection } from '@/components/landing/OpenSourceSection';
import { ReleaseStats } from '@/components/landing/ReleaseStats';
import { SystemSpecimen } from '@/components/landing/SystemSpecimen';
import { CATEGORY_SYSTEM } from '@/lib/brand';
import { browserEntries, categorySummaries, populatedCategories } from '@/lib/icons';
import { mapEntries, populatedMapRegions } from '@/lib/maps';
import { LIBRARY, SITE, plural } from '@/lib/site';

export const metadata: Metadata = {
  title: `${SITE.name} — icons for African everyday life`,
  description: SITE.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const entries = browserEntries();
  const categories = populatedCategories();
  const categoryLabels = Object.fromEntries(
    categories.map((category) => [category.id, category.label]),
  );

  return (
    <LibraryProvider entries={entries} defaultSelection={CATEGORY_SYSTEM[0].hero}>
      <Hero categoryLabels={categoryLabels} />
      <IconRibbon />
      <ReleaseStats />

      <section id="browse" className="browse" aria-labelledby="browse-title">
        <div className="shell section-grid">
          <p className="section-label">Browse</p>
          <div className="section-head section-head--tight">
            <h2 id="browse-title">
              {plural(LIBRARY.iconCount, 'icon')} and {plural(LIBRARY.mapCount, 'country map')},
              ready to use.
            </h2>
            <p className="lead">
              Search by name, category or country, then copy the SVG directly. Everything uses{' '}
              <code>currentColor</code>, so it inherits your interface colour without extra edits.
            </p>
          </div>
          {/* `/#maps` lands here; the browser switches itself to map mode. */}
          <span id="maps" className="anchor" aria-hidden="true" />
          <LibraryBrowser
            categories={categories}
            weightsShipped={LIBRARY.weightsShipped}
            proposeHref={SITE.newIssue}
            iconCount={LIBRARY.iconCount}
            maps={mapEntries()}
            mapRegions={populatedMapRegions()}
            defaultMap="nigeria"
          />
        </div>
      </section>

      <CategoryIndex categories={categorySummaries()} />
      <MapsSection />
      <ContextSection />
      <DistributionTree />
      <SystemSpecimen />
      <OpenSourceSection />
    </LibraryProvider>
  );
}
