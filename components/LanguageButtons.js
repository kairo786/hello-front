'use client';

import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh-CN', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
  { code: 'tr', name: 'Turkish' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ur', name: 'Urdu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pa', name: 'Punjabi' },
];

export default function LanguageButtons() {
  const [search, setSearch] = useState('');

  const changeLang = (lang) => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
  };

  const filtered = languages.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg w-72">
      {/* Search */}
      <input
        type="text"
        placeholder="Search language..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      {/* Language list */}
      <div className="max-h-60 overflow-y-auto flex flex-col gap-2">
        {filtered.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLang(lang.code)}
            className="text-left px-3 py-2 hover:bg-gray-100 rounded"
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}
