describe('Kendo UI for jQuery Demo Tests', () => {
  beforeEach(() => {
    cy.visit('https://demos.telerik.com/kendo-ui/');
  });

  it('should navigate to the Button demo and interact with a button', () => {
    // Navigate to the Button demo
    cy.contains('Button').click();

    // Verify the correct demo page has loaded
    cy.url().should('include', '/button');

    // Verify the first button exists and is clickable
    cy.get('.k-button').first().should('be.visible').click();
  });
});
