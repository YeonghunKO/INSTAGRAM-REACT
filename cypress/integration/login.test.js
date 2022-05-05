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
        .type('test123');
      cy.get('button').click();
      cy.wait(3000);
    });
  });

  it('inputs email address and password and submits the form with wrong password', () => {
    cy.get('form').within(() => {
      cy.get('input:first')
        .should('have.attr', 'placeholder', 'Email address')
        .type('yhko1988@gmail.com');
      cy.get('input:second')
        .should('have.attr', 'placeholder', 'Email password')
        .type('wrongpassword');
      cy.get('button').click();
    });
    cy.get('body').within(() => {
      cy.get('div').should('contain.text', "Sorry Couldn't find users");
    });
  });

  it('navigates to the sign up page and back again', () => {
    cy.get('[data-testid="sign-up"]').click();
    cy.get('body').within(() => {
      cy.get('div').should('contain.text', 'Have an account?');
    });

    cy.get('[data-testid="log-in"]').click();
    cy.get('body').within(() => {
      cy.get('div').should('contain.text', "Don't have an account?");
    });
  });
});
