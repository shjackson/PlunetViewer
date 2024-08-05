/// <reference types="cypress" />
import {
  tabGenereteReport,
  selectDate,
  selectDropdownItem,
  typeAndSelectDropdownItem,
} from "../support/commands";

import {
    btnGenerete,
    btnDownload,
    btnDownloadOk,
    btnResetReport
} from "../support/components"

describe("Generate Report Functionality", () => {
  
  beforeEach(() => {
    cy.visit("/", { failOnStatusCode: false });
    cy.intercept({
      method: "GET", // o 'POST', 'PUT', 'DELETE', etc., según el tipo de petición
      url: "**/*", // patrón de URL para interceptar todas las peticiones
    }).as("interceptedRequest");
  });

  it('should generate a report with "Margin" selected from the dropdown', () => {
    tabGenereteReport();
    selectDate("2024-06-14", "2024-06-14");
    selectDropdownItem("Margin");
    
    btnGenerete().click();
    cy.get('.ant-table-extensions tbody tr').should('have.length.gt', 0);
    btnDownload().click();
    btnDownloadOk().click();
  });

  it('should generate a report with "Margin" selected from typing and selecting', () => {
    tabGenereteReport();
    selectDate("2024-06-14", "2024-06-14");
    typeAndSelectDropdownItem("Margi");
   btnGenerete().click();
    btnDownload().click();
    btnDownloadOk().click();
  });

  it("should not generate a report when no report type is selected", () => {
    tabGenereteReport();
    selectDate("2024-06-14", "2024-06-14");
   btnGenerete().click();
  });

  it("should not download a report when no report type is selected", () => {
    tabGenereteReport();
    selectDate("2024-06-14", "2024-06-14");
    btnDownload().click();
    btnDownloadOk().click();
  });

  it("should delete the selected report and remove the information from the table when the 'Cancel' button is pressed", () => {
    tabGenereteReport();
    selectDate("2024-06-14", "2024-06-14");
    selectDropdownItem("Margin");
   btnGenerete().click();
   btnResetReport().click();
    cy.get(".ant-table-extensions tbody tr").should("have.length.gt", 0);
    cy.get("#rc_select_1").click().wait(500);
    cy.get(".ant-select-dropdown .ant-select-item-option-selected").should(
      "not.exist"
    );
  });
  
});
