import type { Lang } from '../content/types';
import type { UIStrings } from '../content/ui';

/** Workshop credit. Names and the workshop title stay in English as given by the organisers. */
export function Credits({ t, lang }: { t: UIStrings; lang: Lang }) {
  return (
    <aside className="credits" aria-label={t.creditsLead}>
      <p className="credits__lead">{t.creditsLead}</p>
      <p className="credits__title" lang="en">
        “How to Obtain and Create Information Effectively in the AI Age: A Very Short Introduction”
      </p>
      <p className="credits__by">
        {t.creditsBy} <span lang="en">Dr. Jeremy Ng, Ms. Cindy Liang</span>
      </p>
      <p className="credits__org">
        {lang === 'zh' ? (
          <>
            香港大學教育學院
            <br />
            <span lang="en">Faculty of Education, The University of Hong Kong</span>
          </>
        ) : (
          <>
            Faculty of Education
            <br />
            The University of Hong Kong
          </>
        )}
      </p>
    </aside>
  );
}
