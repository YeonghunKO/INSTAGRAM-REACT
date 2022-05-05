describe('dashboard', () => {
  before(() => {
    cy.visit('/login');

    cy.get('form').within(() => {
      cy.get('input:first')
        .should('have.attr', 'placeholder', 'Email address')
        .type('yhko1988@gmail.com');
      cy.get('input:second')
        .should('have.attr', 'placeholder', 'Email password')
        .type('password');
      cy.get('button').click();
      cy.wait(3000);
    });

    cy.get('div')
      .find('img')
      .should('be.visible')
      .should('have.attr', 'alt')
      .should('contain', 'Instagram');
  });

  it('logs the user in and show the dashboard and does basic check around UI', () => {
    cy.get('body').within(() => {
      cy.get('div').should('contain.text', 'sinkyo');
      cy.get('div').should('contain.text', 'KO YEONG HUN');
      cy.get('div').should('contain.text', 'Suggestions for you');
    });
  });

  it('logs the user in and add comments to a photo', () => {
    cy.get('form').within(() => {
      cy.get('[data-testid="add-comment-N0lCtBKrZszEvlB8cTF5"]')
        .should('have.attr', 'placeholder', 'Add a comments...')
        .type('cypress is brilliant!');
    });
    cy.get('body').within(() => {
      cy.get('div').should('contain.text', 'cypress is brilliant!');
    });
  });

  it('logs the user in and click like button', () => {
    cy.get('[data-testid="like-photo-N0lCtBKrZszEvlB8cTF5"]').click();
  });

  it('logs the user in and signs the user out', () => {
    cy.get('[data-testid="sign-out"]')
      .should('have.attr', 'title', 'Sign out')
      .click();
    cy.get('div').should('contain.text', "Don't have an account? Sign up");
  });
});
