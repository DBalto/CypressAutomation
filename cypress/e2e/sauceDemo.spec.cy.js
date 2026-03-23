describe('Sauce Demo Tests', () => {
  beforeEach(() => {
    // baseUrl is set in cypress.config.js
    cy.visit('/');
  });

  // -------------------------------------------------------
  // POSITIVE / HAPPY PATH
  // -------------------------------------------------------

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

  // -------------------------------------------------------
  // NEGATIVE / INVALID LOGIN SCENARIOS
  // -------------------------------------------------------

  it('should show an error when logging in with an invalid username', () => {
    cy.get('[data-test="username"]').type('invalid_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Username and password do not match');
  });

  it('should show an error when logging in with an invalid password', () => {
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('wrong_password');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Username and password do not match');
  });

  it('should show an error when both username and password are empty', () => {
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Username is required');
  });

  it('should show an error when username is empty but password is provided', () => {
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Username is required');
  });

  it('should show an error when password is empty but username is provided', () => {
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Password is required');
  });

  it('should show a specific error for a locked out user', () => {
    cy.login('locked_out_user', 'secret_sauce');
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Sorry, this user has been locked out');
  });

  // -------------------------------------------------------
  // CART BEHAVIOR
  // -------------------------------------------------------

  it('should add an item to the cart and update the cart badge', () => {
    cy.login('standard_user', 'secret_sauce');
    cy.get('.inventory_item').first().find('button').click();
    cy.get('.shopping_cart_badge').should('have.text', '1');
  });

  it('should remove an item from the cart and update the cart badge', () => {
    cy.login('standard_user', 'secret_sauce');
    cy.get('.inventory_item').first().find('button').click();
    cy.get('.shopping_cart_badge').should('have.text', '1');
    cy.get('.inventory_item').first().find('button').click();
    cy.get('.shopping_cart_badge').should('not.exist');
  });

  it('should not allow cart count to exceed the number of available items', () => {
    cy.login('standard_user', 'secret_sauce');
    cy.get('.inventory_item').then(($items) => {
      const totalItems = $items.length;
      cy.get('.inventory_item button').each(($btn) => {
        cy.wrap($btn).click();
      });
      cy.get('.shopping_cart_badge')
        .invoke('text')
        .then((text) => {
          expect(parseInt(text)).to.equal(totalItems);
        });
    });
  });

  // -------------------------------------------------------
  // SORTING / FILTERING
  // -------------------------------------------------------

  it('should sort products by price low to high', () => {
    cy.login('standard_user', 'secret_sauce');
    // Explicitly confirm we are on the inventory page and the sort
    // container is present before interacting with it.
    cy.url().should('include', '/inventory.html');
    cy.get('[data-test="product_sort_container"]')
      .should('be.visible')
      .select('lohi');
    cy.get('.inventory_item_price').then(($prices) => {
      const prices = [...$prices].map((el) =>
        parseFloat(el.innerText.replace('$', ''))
      );
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).to.deep.equal(sorted);
    });
  });

  it('should sort products by name A to Z', () => {
    cy.login('standard_user', 'secret_sauce');
    // Explicitly confirm we are on the inventory page and the sort
    // container is present before interacting with it.
    cy.url().should('include', '/inventory.html');
    cy.get('[data-test="product_sort_container"]')
      .should('be.visible')
      .select('az');
    cy.get('.inventory_item_name').then(($names) => {
      const names = [...$names].map((el) => el.innerText);
      const sorted = [...names].sort();
      expect(names).to.deep.equal(sorted);
    });
  });

  // -------------------------------------------------------
  // PRODUCT DETAIL PAGE
  // -------------------------------------------------------

  it('should navigate to a product detail page and display product details', () => {
    cy.login('standard_user', 'secret_sauce');
    cy.get('.inventory_item_name').first().click();
    cy.url().should('include', '/inventory-item.html');
    cy.get('.inventory_details_name').should('be.visible');
    cy.get('.inventory_details_price').should('be.visible');
    cy.get('.inventory_details_desc').should('be.visible');
  });

  // -------------------------------------------------------
  // CHECKOUT FLOW
  // -------------------------------------------------------

  it('should complete a full checkout flow successfully', () => {
    cy.login('standard_user', 'secret_sauce');
    cy.get('.inventory_item').first().find('button').click();
    cy.get('.shopping_cart_link').click();
    cy.url().should('include', '/cart.html');
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type('John');
    cy.get('[data-test="lastName"]').type('Doe');
    cy.get('[data-test="postalCode"]').type('12345');
    cy.get('[data-test="continue"]').click();
    cy.url().should('include', '/checkout-step-two.html');
    cy.get('[data-test="finish"]').click();
    cy.get('.complete-header').should('contain', 'Thank you for your order!');
  });

  it('should show a validation error when checkout form fields are empty', () => {
    cy.login('standard_user', 'secret_sauce');
    cy.get('.inventory_item').first().find('button').click();
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'First Name is required');
  });

  it('should show a validation error when last name is missing at checkout', () => {
    cy.login('standard_user', 'secret_sauce');
    cy.get('.inventory_item').first().find('button').click();
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type('John');
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Last Name is required');
  });

  it('should show a validation error when postal code is missing at checkout', () => {
    cy.login('standard_user', 'secret_sauce');
    cy.get('.inventory_item').first().find('button').click();
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type('John');
    cy.get('[data-test="lastName"]').type('Doe');
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Postal Code is required');
  });

  it('should allow cancelling checkout and return to cart', () => {
    cy.login('standard_user', 'secret_sauce');
    cy.get('.inventory_item').first().find('button').click();
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="cancel"]').click();
    cy.url().should('include', '/cart.html');
  });

  // -------------------------------------------------------
  // BOUNDARY CONDITIONS
  // -------------------------------------------------------

  it('should show an empty cart when no items have been added', () => {
    cy.login('standard_user', 'secret_sauce');
    cy.get('.shopping_cart_link').click();
    cy.url().should('include', '/cart.html');
    cy.get('.cart_item').should('not.exist');
  });

  it('should not display a cart badge when the cart is empty', () => {
    cy.login('standard_user', 'secret_sauce');
    cy.get('.shopping_cart_badge').should('not.exist');
  });
});
