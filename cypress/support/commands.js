// ***********************************************
// Custom Cypress Commands
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Low-level login command.
 * Only fills in credentials and clicks the login button.
 * Does NOT assert the resulting page state — the caller is responsible.
 * Use this for negative login tests (e.g. locked out user, bad credentials).
 *
 * Usage: cy.login('locked_out_user', 'secret_sauce')
 *
 * @param {string} username - The username to log in with
 * @param {string} password - The password to log in with
 */
Cypress.Commands.add('login', (username, password) => {
  cy.get('[data-test="username"]').type(username);
  cy.get('[data-test="password"]').type(password);
  cy.get('[data-test="login-button"]').click();
});

/**
 * High-level login command for standard_user.
 * Submits credentials AND waits for the inventory page to be fully ready
 * before returning control to the test.
 * Use this for any test that needs to start from a logged-in inventory state.
 *
 * Usage: cy.loginAsStandardUser()
 */
Cypress.Commands.add('loginAsStandardUser', () => {
  cy.get('[data-test="username"]').type('standard_user');
  cy.get('[data-test="password"]').type('secret_sauce');
  cy.get('[data-test="login-button"]').click();
  // Guard: ensure the inventory page is fully loaded before proceeding.
  cy.url().should('include', '/inventory.html');
  cy.get('.inventory_list').should('be.visible');
  cy.get('[data-test="product_sort_container"]').should('be.visible');
});
