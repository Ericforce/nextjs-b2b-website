import { Fragment, type ReactNode } from 'react';
import type { Section } from '@/types/sanity';
import { Hero } from './sections/Hero';
import { Features } from './sections/Features';
import { Testimonials } from './sections/Testimonials';
import { CallToAction } from './sections/CallToAction';
import { RichText } from './sections/RichText';
import { Stats } from './sections/Stats';
import { FAQ } from './sections/FAQ';

type SectionRendererMap = {
  [Type in Section['_type']]: (section: Extract<Section, { _type: Type }>) => ReactNode;
};

const SECTION_COMPONENTS: SectionRendererMap = {
  hero: (section) => <Hero {...section} />,
  features: (section) => <Features {...section} />,
  testimonials: (section) => <Testimonials {...section} />,
  cta: (section) => <CallToAction {...section} />,
  richText: (section) => <RichText {...section} />,
  stats: (section) => <Stats {...section} />,
  faq: (section) => <FAQ {...section} />,
};

export function SectionRenderer({ sections }: { sections: Section[] }) {
  if (!sections?.length) {
    return null;
  }

  return (
    <Fragment>
      {sections.map((section) => {
        const render = SECTION_COMPONENTS[section._type as keyof SectionRendererMap];

        if (!render) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`Unknown section type: ${section._type}`);
          }
          return null;
        }

        return <Fragment key={section._key}>{render(section as never)}</Fragment>;
      })}
    </Fragment>
  );
}
