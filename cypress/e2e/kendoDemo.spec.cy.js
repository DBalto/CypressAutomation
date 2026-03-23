describe('Kendo UI for jQuery Demo Tests', () => {
  beforeEach(() => {
    cy.visit('https://demos.telerik.com/kendo-ui/');
  });

  // -------------------------------------------------------
  // POSITIVE / HAPPY PATH
  // -------------------------------------------------------

  it('should navigate to the Button demo and interact with a button', () => {
    cy.contains('Button').click();
    cy.url().should('include', '/button');
    cy.get('.k-button').first().should('be.visible').click();
  });

  it('should verify the page title on load', () => {
    cy.title().should('include', 'Kendo UI');
  });

  // -------------------------------------------------------
  // BUTTON COMPONENT TESTS
  // -------------------------------------------------------

  it('should verify button label text is not empty', () => {
    cy.contains('Button').click();
    cy.url().should('include', '/button');
    cy.get('.k-button').first().invoke('text').should('not.be.empty');
  });

  it('should verify a disabled button cannot be interacted with', () => {
    cy.contains('Button').click();
    cy.url().should('include', '/button');
    cy.get('.k-button[disabled]').should('exist').and('be.disabled');
  });

  // -------------------------------------------------------
  // GRID COMPONENT TESTS
  // -------------------------------------------------------

  it('should navigate to the Grid demo and verify data loads', () => {
    cy.contains('Grid').click();
    cy.url().should('include', '/grid');
    cy.get('.k-grid').should('be.visible');
    cy.get('.k-grid tbody tr').should('have.length.greaterThan', 0);
  });

  it('should verify grid column headers are visible', () => {
    cy.contains('Grid').click();
    cy.url().should('include', '/grid');
    cy.get('.k-grid thead th').should('have.length.greaterThan', 0);
  });

  // -------------------------------------------------------
  // NAVIGATION EDGE CASES
  // -------------------------------------------------------

  it('should return to the home page when clicking the logo', () => {
    cy.contains('Button').click();
    cy.url().should('include', '/button');
    cy.get('.k-logo, .logo, [aria-label="logo"]').first().click();
    cy.url().should('include', 'demos.telerik.com/kendo-ui');
  });