describe('tabs--vertical', () => {
  const verifyTabsSetup = () => {
    cy.checkA11y(null, {
      rules: {
        'page-has-heading-one': { enabled: false },
        'landmark-one-main': { enabled: false },
      },
    });

    cy.findByRole('tablist').should('exist');
    cy.findByRole('tablist').should('have.attr', 'aria-label');
    cy.findByRole('tablist').should('have.attr', 'data-orientation', 'vertical');
    cy.findByRole('tablist').should('have.attr', 'aria-orientation', 'vertical');
    cy.findAllByRole('tab').should('have.length', 3);
    cy.findByRole('tab', { name: /account/i }).should('have.attr', 'aria-controls', 'brn-tabs-content-account');
    cy.findByRole('tab', { name: /password/i }).should('have.attr', 'aria-controls', 'brn-tabs-content-password');
    cy.findByRole('tab', { name: /danger zone/i }).should('have.attr', 'aria-controls', 'brn-tabs-content-danger');
    cy.findByRole('tabpanel').should('exist');
  };

  describe('default', () => {
    beforeEach(() => {
      cy.visit('/iframe.html?id=tabs--vertical');
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

    it('tab and arrow interactions should render with first tab selected and change to second tab when second tab is focused with arrow right, return to first tab with arrow left and do nothing on arrow up or down', () => {
      verifyTabsSetup();

      cy.realPress('Tab');
      cy.realPress('ArrowDown');
      cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-password');
      cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
      cy.findByRole('heading', { name: /password/i }).should('exist');

      cy.realPress('ArrowUp');
      cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-account');
      cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
      cy.findByRole('heading', { name: /account/i }).should('exist');

      // should ignore left and right
      cy.realPress('ArrowLeft');
      cy.findByRole('heading', { name: /account/i }).should('exist');

      cy.realPress('ArrowRight');
      cy.findByRole('heading', { name: /account/i }).should('exist');

      // should jump to last on end
      cy.realPress('End');
      cy.findByRole('tabpanel').should('have.attr', 'aria-labelledby', 'brn-tabs-label-danger');
      cy.findByRole('tabpanel').should('have.attr', 'tabindex', '0');
      cy.findByRole('heading', { name: /delete account/i }).should('exist');

      // should wrap arround
      cy.realPress('ArrowDown');
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
