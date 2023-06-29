describe('tabs--default--manual', () => {
  const verifyTabsSetup = () => {
    cy.checkA11y(null, {
      rules: {
        'page-has-heading-one': { enabled: false },
        'landmark-one-main': { enabled: false },
      },
    });

    cy.findByRole('tablist').should('exist');
    cy.findByRole('tablist').should('have.attr', 'aria-label');
    cy.findByRole('tablist').should('have.attr', 'data-orientation', 'horizontal');
    cy.findByRole('tablist').should('have.attr', 'aria-orientation', 'horizontal');
    cy.findAllByRole('tab').should('have.length', 2);
    cy.findByRole('tab', { name: /account/i }).should('have.attr', 'aria-controls', 'brn-tabs-content-account');
    cy.findByRole('tab', { name: /password/i }).should('have.attr', 'aria-controls', 'brn-tabs-content-password');
    cy.findByRole('tabpanel').should('exist');
  };

  describe('default', () => {
    beforeEach(() => {
      cy.visit('/iframe.html?id=tabs--default&args=activationMode:manual');
      cy.injectAxe();
    });

    it('click interactions should render with first tab selected and change to second tab when second tab is clicked', () => {
      verifyTabsSetup();

      cy.findByRole('tab', { name: /password/i }).click();

      cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-password');
      cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
      cy.findByRole('tab', { name: /password/i }).should('have.attr', 'aria-selected', 'true');
      cy.findByRole('tab', { name: /account/i }).should('have.attr', 'aria-selected', 'false');
      cy.findByRole('heading', { name: /password/i }).should('exist');

      cy.findByRole('tab', { name: /account/i }).click();

      cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-account');
      cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
      cy.findByRole('tab', { name: /account/i }).should('have.attr', 'aria-selected', 'true');
      cy.findByRole('tab', { name: /password/i }).should('have.attr', 'aria-selected', 'false');
      cy.findByRole('heading', { name: /account/i }).should('exist');
    });

    it('tab and arrow interactions should render with first tab selected and change to second tab when second tab is focused and confirmed with enter with arrow right, return to first tab with arrow left and do nothing on arrow up or down', () => {
      verifyTabsSetup();

      cy.realPress('Tab');
      cy.realPress('ArrowRight');
      cy.findByRole('heading', { name: /password/i }).should('not.exist');
      cy.realPress('Enter');
      cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-password');
      cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
      cy.findByRole('heading', { name: /password/i }).should('exist');

      cy.realPress('ArrowLeft');
      cy.realPress('Enter');
      cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-account');
      cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
      cy.findByRole('heading', { name: /account/i }).should('exist');

      // should ignore up and down
      cy.realPress('ArrowUp');
      cy.realPress('Enter');
      cy.findByRole('heading', { name: /account/i }).should('exist');

      cy.realPress('ArrowDown');
      cy.realPress('Enter');
      cy.findByRole('heading', { name: /account/i }).should('exist');

      // should jump to last on end
      cy.realPress('End');
      cy.realPress('Space');
      cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-password');
      cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
      cy.findByRole('heading', { name: /password/i }).should('exist');

      // should wrap arround
      cy.realPress('ArrowRight');
      cy.realPress('Enter');
      cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-account');
      cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
      cy.findByRole('heading', { name: /account/i }).should('exist');

      // jump between list and panel on tab
      cy.realPress('Tab');
      cy.findByRole('tabpanel').should('be.focused');
      cy.realPress(['Shift', 'Tab']);
      cy.findByRole('tab', { name: /account/i }).should('be.focused');
    });
  });
});
