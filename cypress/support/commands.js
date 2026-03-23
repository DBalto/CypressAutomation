// ***********************************************
// Custom Cypress Commands
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom login command for the Sauce Demo site.
 * Avoids repeating login steps across multiple tests.
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
});
