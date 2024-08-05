import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const defaultLocale = 'en'; 
  let locale = process.env.NEXT_LOCALE || defaultLocale; 
  
  if (typeof window !== 'undefined' && window.navigator.language) {
    const navigatorLanguage = window.navigator.language.split('-')[0]; 
    if (navigatorLanguage && ['en', 'es'].includes(navigatorLanguage)) {
      locale = navigatorLanguage; 
    }
  }

  try {
    const messages = await import(`../messages/${locale}.json`);
    return {
      locale,
      messages: messages.default,
    };
  } catch (error) {
    console.error(`Error loading messages for locale '${locale}':`, error);
    return {
      locale: defaultLocale,
      messages: {},
    };
  }
});
