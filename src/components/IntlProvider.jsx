"use client";

import { NextIntlClientProvider } from "next-intl";
import React, { useEffect, useState } from "react";
import { Spin } from "antd";

const IntlProvider = ({ children }) => {
  const [locale, setLocale] = useState("en");
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async (locale) => {
      try {
        const messages = await import(`../../messages/${locale}.json`);
        setMessages(messages.default);
        setLocale(locale);
        setLoading(false);
      } catch (error) {
        console.error(`Error loading messages for locale '${locale}':`, error);
        setLoading(false);
      }
    };

    const navigatorLanguage = window.navigator.language.split("-")[0];
    if (navigatorLanguage && ["en"].includes(navigatorLanguage)) {
      loadMessages(navigatorLanguage);
    } else {
      loadMessages("en");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen custom-background">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};

export default IntlProvider;
