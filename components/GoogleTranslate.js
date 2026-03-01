'use client';

import { useEffect } from 'react';

export default function GoogleTranslate() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateInit';
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{ display: 'none' }}
    ></div>
  );
}
