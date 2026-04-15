/**
 * auth.cy.js
 * ---------------------------------------------------------
 * E2E tests for authentication flow
 */

describe('Authentication', () => {
  /**
   * Test: Register
   */
  describe('Register', () => {
    beforeEach(() => {
      cy.visit('/register')
    })

    it('allows a new user to register', () => {
      const username = `testuser_${Date.now()}`

      cy.get('#username').type(username)
      cy.get('#password').type('testpassword')
      cy.get('#confirmPassword').type('testpassword')
      cy.get('.btn-primary').click()

      // Successful registration alerts and redirects to login
      cy.on('window:alert', text => {
        expect(text).to.equal('User created successfully')
      })
      cy.url().should('include', '/login')
    })

    it('shows alert when username or password is missing', () => {
      cy.get('.btn-primary').click()
      cy.on('window:alert', text => {
        expect(text).to.equal('Username and password required')
      })
    })

    it('shows alert when password is too short', () => {
      cy.get('#username').type('testuser')
      cy.get('#password').type('abc')
      cy.get('#confirmPassword').type('abc')
      cy.get('.btn-primary').click()
      cy.on('window:alert', text => {
        expect(text).to.equal('Password must be at least 6 characters')
      })
    })

    it('shows alert when passwords do not match', () => {
      cy.get('#username').type('testuser')
      cy.get('#password').type('testpassword')
      cy.get('#confirmPassword').type('differentpassword')
      cy.get('.btn-primary').click()
      cy.on('window:alert', text => {
        expect(text).to.equal('Passwords do not match')
      })
    })

    it('shows alert when username already exists', () => {
      cy.get('#username').type('testuser')
      cy.get('#password').type('testpassword')
      cy.get('#confirmPassword').type('testpassword')
      cy.get('.btn-primary').click()
      cy.on('window:alert', text => {
        expect(text).to.equal('Username already exists')
      })
    })
  })

  /**
   * Test: Login
   */
  describe('Login', () => {
    beforeEach(() => {
      cy.visit('/login')
    })

    it('allows a registered user to log in', () => {
      cy.get('#username').type('testuser')
      cy.get('#password').type('testpassword')
      cy.get('.btn-primary').click()
      cy.on('window:alert', text => {
        expect(text).to.equal('Login successful')
      })
      cy.url().should('include', '/credentials/all')
    })

    it('shows alert when username or password is missing', () => {
      cy.get('.btn-primary').click()
      cy.on('window:alert', text => {
        expect(text).to.equal('Please enter username and password')
      })
    })

    it('shows alert on invalid credentials', () => {
      cy.get('#username').type('wronguser')
      cy.get('#password').type('wrongpassword')
      cy.get('.btn-primary').click()
      cy.on('window:alert', text => {
        expect(text).to.equal('Invalid username or password')
      })
    })
  })

  /**
   * Test: Logout
   */
  describe('Logout', () => {
    it('logs out and clears token', () => {
      cy.login('testuser', 'testpassword')
      cy.contains('Logout').click()
      cy.url().should('include', '/login')
      cy.window().then(win => {
        expect(win.localStorage.getItem('token')).to.be.null
      })
    })
  })
})