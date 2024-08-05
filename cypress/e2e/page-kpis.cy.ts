/// <reference types="cypress" />

import { goToKpisPage } from "../support/commands";

describe("Show charts functionality", () => {
  beforeEach(() => {
    cy.visit("/", { failOnStatusCode: false });
    cy.intercept({
        method: "GET", 
        url: "**/*",
      }).as("interceptedRequest");
  });

  it("should show a chart with data", () => {
    goToKpisPage();

    cy.get(
      '.mt-4 > [style="margin: 0px auto; row-gap: 16px; max-width: 100%;"] > :nth-child(1) > .ant-card > .ant-card-body'
    ).wait(500)
      .should("exist") 
      .within(() => {
        cy.get('canvas').should('have.length.gt', 0);  
      });
  });
});
