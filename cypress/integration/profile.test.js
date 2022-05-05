describe('profile', () => {
  before(() => {
    cy.visit('/p/raphael');
  });

  it('goes to a profile page and validate the UI', () => {
    cy.get('body').within(() => {
      cy.get('div').should('contain.text', 'raphael');
      cy.get('div').should('contain.text', '7 photos');
      cy.get('div').should('contain.text', '1 follower');
      cy.get('div').should('contain.text', '0 following');
      cy.get('div').should('contain.text', 'Raffaello Sanzio da Urbino');

      cy.get('[data-testid="photos"]').should('have.length', 7);
    });
  });
});
