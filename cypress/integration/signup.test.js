describe('Login', () => {
  beforeEach(() => {
    cy.visit('/sign-up');

    cy.get('body').within(() => {
      cy.get('div').should('contain.text', 'Have an account? Log in');
    });
    cy.get('div')
      .find('img')
      .should('be.visible')
      .should('have.attr', 'alt')
      .should('contain', 'Iphone Login picture');
  });

  it('signs user up with valid email and password', () => {
    const inputInfos = [
      { whichInput: 'first', placeHolder: 'username', type: 'lala' },
      { whichInput: 'second', placeHolder: 'fullname', type: 'LALA' },
      {
        whichInput: 'third',
        placeHolder: 'Email address',
        type: 'test@gmail.com',
      },
      { whichInput: 'fourth', placeHolder: 'Email password', type: 'test' },
    ];
    cy.get('form').within(() => {
      cy.wrap(inputInfos).each(info => {
        cy.get(info.whichInput)
          .should('have.attr', 'placeholder', info.placeHolder)
          .type(info.type);
      });
      cy.get('button').click();
    });
  });

  it('signs user up with invalid email', () => {
    const inputInfos = [
      { whichInput: 'first', placeHolder: 'username', type: 'lala' },
      { whichInput: 'second', placeHolder: 'fullname', type: 'LALA' },
      {
        whichInput: 'third',
        placeHolder: 'Email address',
        type: 'test.com',
      },
      { whichInput: 'fourth', placeHolder: 'Email password', type: 'test' },
    ];
    cy.get('form').within(() => {
      cy.wrap(inputInfos).each(info => {
        cy.get(info.whichInput)
          .should('have.attr', 'placeholder', info.placeHolder)
          .type(info.type);
      });
      cy.get('button').click();
    });

    cy.get('body').within(() => {
      cy.get('div').should(
        'contain.text',
        'Firebase: Error (auth/invalid-email).'
      );
    });
  });

  it('signs user up with email that already exists', () => {
    const inputInfos = [
      { whichInput: 'first', placeHolder: 'username', type: 'lala' },
      { whichInput: 'second', placeHolder: 'fullname', type: 'LALA' },
      {
        whichInput: 'third',
        placeHolder: 'Email address',
        type: 'yhko1988@gmail.com',
      },
      { whichInput: 'fourth', placeHolder: 'Email password', type: 'password' },
    ];
    cy.get('form').within(() => {
      cy.wrap(inputInfos).each(info => {
        cy.get(info.whichInput)
          .should('have.attr', 'placeholder', info.placeHolder)
          .type(info.type);
      });
      cy.get('button').click();
    });

    cy.get('body').within(() => {
      cy.get('div').should(
        'contain.text',
        'Firebase: Error (auth/email-already-in-use).'
      );
    });
  });
});
