import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const version = config.env.version || "local";
      config.env = require(`./cypress/config/${version}.json`);
      config.baseUrl = config.env.baseUrl;
      return config;
    },
  },
});


/*
https://www.linkedin.com/pulse/gu%C3%ADa-para-testers-y-qas-que-inician-tips-recursos-m%C3%A1s-diego-gavilanes/
https://docs.cypress.io/guides/guides/network-requests
https://www.fceia.unr.edu.ar/ingsoft/testing-intro-a.pdf
https://filiphric.com/how-to-structure-a-big-project-in-cypress
*/