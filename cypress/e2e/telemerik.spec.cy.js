describe('Telerik Demo Tests', () => {
    beforeEach(() => {
      cy.visit('https://www.telerik.com/support/demos');
    });
  
    it('should navigate to a specific demo', () => {
      cy.contains('Kendo UI for jQuery').click();
      cy.url().should('include', '/kendo-ui');
  
      // Verify that the demo page has loaded by checking for a specific element
      cy.get('.ProductPromo-title').should('contain', 'Kendo UI for jQuery');
    });
  
    it('should interact with a demo component', () => {
      cy.contains('Kendo UI for jQuery').click();
      cy.contains('Demos').click();
  
      // Assuming there is a demo that can be interacted with, like a button
      cy.contains('Button').click();
      cy.get('.k-button').should('exist');
      cy.get('.k-button').first().click();
    });
  });
  