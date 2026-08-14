import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';

export default function AboutUs() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Seo title={t('about.title')} description={t('about.metaDescription')} path="/about" />

      <h1 className="font-display text-3xl text-ink mb-2">{t('about.title')}</h1>
      <p className="text-gray-500 mb-10">{t('about.tagline')}</p>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-semibold text-gray-900 text-base mb-2">{t('about.missionTitle')}</h2>
          <p>{t('about.missionBody')}</p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 text-base mb-2">{t('about.whatWeOfferTitle')}</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>{t('about.offer1')}</li>
            <li>{t('about.offer2')}</li>
            <li>{t('about.offer3')}</li>
            <li>{t('about.offer4')}</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 text-base mb-2">{t('about.contactTitle')}</h2>
          <p>
            {t('about.contactBody')}
            {' '}
            <a href="mailto:hello@khaobd.com" className="text-brand-600 font-medium hover:text-brand-700">
              hello@khaobd.com
            </a>
          </p>
        </section>
      </div>

      <div className="mt-10">
        <Link
          to="/restaurants"
          className="inline-block bg-brand-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-brand-600"
        >
          {t('about.exploreCta')}
        </Link>
      </div>
    </div>
  );
}
