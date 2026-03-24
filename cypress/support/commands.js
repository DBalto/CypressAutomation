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
 *
 * Guard order is intentional and important:
 *   1. Wait for URL to confirm navigation completed.
 *   2. Wait for the inventory list container to be visible (early React render).
 *   3. Wait for actual product items to exist — these only appear after the
 *      product data has loaded. This is the key gate.
 *   4. Only then assert the sort container, which React renders after products
 *      are available. Without step 3, step 4 can fail because the sort
 *      container is conditionally rendered based on product data being present.
 *
 * Usage: cy.loginAsStandardUser()
 */
Cypress.Commands.add('loginAsStandardUser', () => {
  cy.get('[data-test="username"]').type('standard_user');
  cy.get('[data-test="password"]').type('secret_sauce');
  cy.get('[data-test="login-button"]').click();

  // Step 1: Confirm navigation to the inventory page completed.
  cy.url().should('include', '/inventory.html');

  // Step 2: Confirm the inventory list container has mounted.
  cy.get('.inventory_list').should('be.visible');

  // Step 3: Confirm product items have rendered — this means product data
  // has loaded from the backend and React has finished its data-driven render.
  // This is the critical gate that was previously missing.
  cy.get('.inventory_item').should('have.length.greaterThan', 0);

  // Step 4: Now it is safe to assert the sort container, since it only
  // renders after product data is available.
  cy.get('[data-test="product_sort_container"]').should('be.visible');
});
