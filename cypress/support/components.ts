/// <reference types="cypress" />

export function btnGenerete() {
    return cy.get('.ant-flex .custom-button-active span').first(); 
}

export function btnDownload() {
    return cy.get('[style="margin-bottom: 10px; padding: 0px 20px;"] > :nth-child(2)');
}

export function btnDownloadOk() {
    return cy.get('.ant-modal-footer > .custom-button-active > span');
}

export function btnResetReport() {
    return cy.get('.custom-button-inactive > span');
}