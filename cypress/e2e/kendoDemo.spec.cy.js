describe('Kendo UI for jQuery Demo Tests', () => {
    beforeEach(() => {
      cy.visit('https://demos.telerik.com/kendo-ui/');
    });
  
    it('should navigate to a demo and interact with a button', () => {
      // Click on a demo, e.g., the Button demo
      cy.contains('Button').click();
  
      // Verify that the demo page has loaded
      cy.url().should('include', '/button');
  
      // Interact with a button in the demo
      cy.get('.k-button').first().should('exist').click();
  
      // Verify that the button interaction has taken place
      cy.get('.k-button').first().should('have.class', 'k-state-active');
    });
  });
  