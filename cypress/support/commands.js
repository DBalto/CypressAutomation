// ***********************************************
// Custom Cypress Commands
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom login command for the Sauce Demo site.
 * Avoids repeating login steps across multiple tests.
 *
 * Waits for the inventory page to be fully loaded before resolving,
 * so that subsequent commands can safely interact with page elements.
 *
 * Usage: cy.login('standard_user', 'secret_sauce')
 *
 * @param {string} username - The username to log in with
 * @param {string} password - The password to log in with
 */
Cypress.Commands.add('login', (username, password) => {
  cy.get('[data-test="username"]').type(username);
  cy.get('[data-test="password"]').type(password);
  cy.get('[data-test="login-button"]').click();
  // Wait for the inventory page to load before returning control to the test.
  // This prevents subsequent commands from running before the page is ready.
  cy.url().should('include', '/inventory.html');
  cy.get('.inventory_list').should('be.visible');
});
