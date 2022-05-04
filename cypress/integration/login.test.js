describe('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');

    cy.get('body').within(() => {
      cy.get('div').should('contain.text', "Don't have an account? Sign up");
    });
    cy.get('div')
      .find('img')
      .should('be.visible')
      .should('have.attr', 'alt')
      .should('contain', 'Iphone Login picture');
  });

  it('inputs email address and password and submits the form', () => {
    cy.get('form').within(() => {
      cy.get('input:first')
        .should('have.attr', 'placeholder', 'Email address')
        .type('yhko1988@gmail.com');
      cy.get('input:first')
        .should('have.attr', 'placeholder', 'Email password')
        .type('qoyo3364');
      cy.get('button').click();
    });
  });
});
