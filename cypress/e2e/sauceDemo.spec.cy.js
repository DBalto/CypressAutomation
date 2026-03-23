describe('Sauce Demo Tests', () => {
  beforeEach(() => {
    // baseUrl is set in cypress.config.js
    cy.visit('/');
  });

  it('should log in with valid credentials', () => {
    cy.login('standard_user', 'secret_sauce');
    cy.url().should('include', '/inventory.html');
  });

  it('should display products on the inventory page', () => {
    cy.login('standard_user', 'secret_sauce');
    cy.get('.inventory_item').should('have.length.greaterThan', 0);
  });

  it('should log out successfully', () => {
    cy.login('standard_user', 'secret_sauce');

    cy.get('.bm-burger-button').click();
    cy.get('#logout_sidebar_link').click();

    cy.url().should('eq', 'https://www.saucedemo.com/');
  });
});
