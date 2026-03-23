describe('Telerik Demo Tests', () => {
  beforeEach(() => {
    cy.visit('https://www.telerik.com/support/demos');
  });

  // -------------------------------------------------------
  // POSITIVE / HAPPY PATH
  // -------------------------------------------------------

  it('should load the demos page and verify the page title', () => {
    cy.title().should('include', 'Demos');
  });

  it('should navigate to a specific demo', () => {
    cy.contains('Kendo UI for jQuery').click();
    cy.url().should('include', '/kendo-ui');
    cy.get('.ProductPromo-title').should('contain', 'Kendo UI for jQuery');
  });

  it('should interact with a demo component', () => {
    cy.contains('Kendo UI for jQuery').click();
    cy.contains('Demos').click();
    cy.contains('Button').click();
    cy.get('.k-button').should('exist');
    cy.get('.k-button').first().click();
  });

  // -------------------------------------------------------
  // NEGATIVE / EDGE CASES
  // -------------------------------------------------------

  it('should display a result or message when searching for a non-existent demo', () => {
    // Attempt to find a search input and search for something that does not exist
    cy.get('input[type="search"], input[placeholder*="search" i]')
      .first()
      .type('xyznonexistentdemo123{enter}');
    // Expect either a no-results message or an empty results list
    cy.get('body').then(($body) => {
      const hasNoResults =
        $body.text().includes('No results') ||
        $body.text().includes('no results') ||
        $body.find('.search-results li').length === 0;
      expect(hasNoResults).to.be.true;
    });
  });

  it('should remain on the demos page when no demo is clicked', () => {
    cy.url().should('include', '/support/demos');
  });

  // -------------------------------------------------------
  // NAVIGATION TESTS
  // -------------------------------------------------------

  it('should display multiple demo product options on the page', () => {
    cy.get('.ProductPromo-title, .product-title, [class*="product"]')
      .should('have.length.greaterThan', 1);
  });

  it('should navigate back to the demos page after visiting a product page', () => {
    cy.contains('Kendo UI for jQuery').click();
    cy.url().should('include', '/kendo-ui');
    cy.go('back');
    cy.url().should('include', '/support/demos');
  });
});
