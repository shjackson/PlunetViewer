/// <reference types="cypress" />


export function tabGenereteReport() {
    cy.get('.ant-menu-item-selected').click();
    cy.get('#rc-tabs-1-tab-1').click();
}

export function selectDate(start: string | null = null, end: string | null = null) {

    if (start === null && end === null) {
        cy.get(".ant-picker").eq(0).click();
        cy.get(".ant-picker-cell-in-view.ant-picker-cell-today").eq(0).click();
        cy.get(".ant-picker-cell-in-view.ant-picker-cell-today").eq(0).click();
    } else {
        cy.get(".ant-picker-input").eq(0).type(start as string).type('{enter}');
        cy.get(".ant-picker-input").eq(1).type(end as string).type('{enter}');
    };
}

export function selectDropdownItem(itemText: string) {
    cy.get('#rc_select_1').click();
    cy.wait(500);
    cy.get('.ant-select-dropdown')
      .should('be.visible')
      .within(() => {
        cy.get('.ant-select-item-option')
          .should('be.visible')
          .contains(itemText)
          .click();
      });
  }

  export function typeAndSelectDropdownItem(itemText: string) {
    cy.get('#rc_select_1').click();
    cy.wait(500);
    cy.get('.ant-select-dropdown')
      .should('be.visible')
      .within(() => {
        cy.get('.ant-select-item-option')
          .should('be.visible')
          .contains(itemText)
      });
    cy.get('.ant-select-item-option')
      .contains(itemText)
      .click();
  }

  export function goToKpisPage() {
    cy.get('.ant-menu-item > .ant-menu-title-content').eq(1).click();
  }