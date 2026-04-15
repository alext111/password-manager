/**
 * credentials.cy.js
 * ---------------------------------------------------------
 * E2E tests for credential management
 */

describe('Credentials', () => {
  beforeEach(() => {
    cy.login('testuser', 'testpassword')
  })

  /**
   * Test: Create
   */
  describe('Create', () => {
    beforeEach(() => {
      cy.visit('/credentials/create')
    })

    it('shows alert when website field is empty', () => {
      cy.get('.btn-primary').click()
      cy.on('window:alert', text => {
        expect(text).to.equal('Please enter a website')
      })
    })

    it('allows user to create a credential', () => {
      cy.get('input[type="text"]').type('example.com')
      cy.get('.btn-primary').click()
      cy.on('window:alert', text => {
        expect(text).to.equal('Credentials successfully created')
      })
    })

    it('shows alert when credentials already exist', () => {
      cy.get('input[type="text"]').type('example.com')
      cy.get('.btn-primary').click()
      cy.on('window:alert', text => {
        expect(text).to.equal('Credentials already exists')
      })
    })
  })

  /**
   * Test: Find all
   */
  describe('Find All', () => {
    it('displays credentials table', () => {
      cy.visit('/credentials/all')
      cy.get('table').should('exist')
      cy.get('thead').within(() => {
        cy.contains('Website').should('exist')
        cy.contains('Encrypted Password').should('exist')
        cy.contains('Last Updated').should('exist')
      })
    })

    it('displays example.com credential in the table', () => {
      cy.visit('/credentials/all')
      cy.contains('td', 'example.com').should('exist')
    })
  })

  /**
   * Test: Find by website
   */
  describe('Find By Website', () => {
    beforeEach(() => {
      cy.visit('/credentials/find')
    })

    it('shows alert when website field is empty', () => {
      cy.get('.btn-primary').click()
      cy.on('window:alert', text => {
        expect(text).to.equal('Please enter a website')
      })
    })

    it('finds and displays password for a website', () => {
      cy.get('input[type="text"]').type('example.com')
      cy.get('.btn-primary').click()
      cy.on('window:alert', text => {
        expect(text).to.equal('Login information successfully found')
      })
      cy.get('[aria-label="Password"]').should('not.be.empty')
    })

    it('shows alert when website is not found', () => {
      cy.get('input[type="text"]').type('notawebsite.com')
      cy.get('.btn-primary').click()
      cy.on('window:alert', text => {
        expect(text).to.equal('Could not find password for the specified website')
      })
    })
  })

  /**
   * Test: Update
   */
  describe('Update', () => {
    beforeEach(() => {
      cy.visit('/credentials/update')
    })

    it('allows user to update a credential', () => {
      cy.get('input[type="text"]').first().type('example.com')
      cy.get('input[type="text"]').last().type('newpassword123')
      cy.get('.btn-primary').click()
      cy.on('window:alert', text => {
        expect(text).to.equal('Password successfully changed and encrypted.')
      })
    })

    it('clears form after successful update', () => {
      cy.get('input[type="text"]').first().type('example.com')
      cy.get('input[type="text"]').last().type('newpassword123')
      cy.get('.btn-primary').click()
      cy.get('input[type="text"]').first().should('have.value', '')
      cy.get('input[type="text"]').last().should('have.value', '')
    })
  })

  /**
   * Test: Delete
   */
  describe('Delete', () => {
    it('allows user to delete a credential', () => {
      cy.visit('/credentials/all')
      cy.contains('td', 'example.com')
        .parent()
        .contains('Delete')
        .click()
      cy.on('window:confirm', () => true)
      cy.contains('td', 'example.com').should('not.exist')
    })
  })
})