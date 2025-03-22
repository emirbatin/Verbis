
// Interface for language definition
export interface Language {
    code: string;       // ISO 639-1 language code
    nativeName: string; // Name of language in its native form
    englishName: string; // Name of language in English
    flag?: string;      // Optional emoji flag
  }
  
  // List of supported languages
  export const LANGUAGES: Language[] = [
    {
      code: 'en',
      nativeName: 'English',
      englishName: 'English',
      flag: '🇬🇧'
    },
    {
      code: 'tr',
      nativeName: 'Türkçe',
      englishName: 'Turkish',
      flag: '🇹🇷'
    },
    {
      code: 'es',
      nativeName: 'Español',
      englishName: 'Spanish',
      flag: '🇪🇸'
    },
    {
      code: 'fr',
      nativeName: 'Français',
      englishName: 'French',
      flag: '🇫🇷'
    },
    {
      code: 'de',
      nativeName: 'Deutsch',
      englishName: 'German',
      flag: '🇩🇪'
    },
    {
      code: 'it',
      nativeName: 'Italiano',
      englishName: 'Italian',
      flag: '🇮🇹'
    },
    {
      code: 'pt',
      nativeName: 'Português',
      englishName: 'Portuguese',
      flag: '🇵🇹'
    },
    {
      code: 'ru',
      nativeName: 'Русский',
      englishName: 'Russian',
      flag: '🇷🇺'
    },
    {
      code: 'zh',
      nativeName: '中文',
      englishName: 'Chinese',
      flag: '🇨🇳'
    },
    {
      code: 'ja',
      nativeName: '日本語',
      englishName: 'Japanese',
      flag: '🇯🇵'
    },
    {
      code: 'ko',
      nativeName: '한국어',
      englishName: 'Korean',
      flag: '🇰🇷'
    },
    {
      code: 'ar',
      nativeName: 'العربية',
      englishName: 'Arabic',
      flag: '🇸🇦'
    },
    {
      code: 'hi',
      nativeName: 'हिन्दी',
      englishName: 'Hindi',
      flag: '🇮🇳'
    }
  ];
  
  // Default source language
  export const DEFAULT_SOURCE_LANGUAGE: Language = LANGUAGES.find(lang => lang.code === 'en') || LANGUAGES[0];
  
  // Default target language
  export const DEFAULT_TARGET_LANGUAGE: Language = LANGUAGES.find(lang => lang.code === 'tr') || LANGUAGES[1];
  
  // Helper function to get a language by its code
  export const getLanguageByCode = (code: string): Language | undefined => {
    return LANGUAGES.find(lang => lang.code === code);
  };
  
  // Helper function to get language name (native or English)
  export const getLanguageName = (code: string, useNative: boolean = true): string => {
    const language = getLanguageByCode(code);
    if (!language) return code;
    return useNative ? language.nativeName : language.englishName;
  };
  
  // Helper function to get pairs of supported languages for the dropdown
  export const getLanguagePairs = (): { label: string, value: string }[] => {
    return LANGUAGES.map(lang => ({
      label: `${lang.flag} ${lang.nativeName} (${lang.englishName})`,
      value: lang.code
    }));
  };