/// <reference types="cypress" />

Cypress.Commands.add('login', (username, password) => {
  cy.request('POST', '/api/auth/login', { username, password })
    .then(({ body }) => {
      localStorage.setItem('token', body.token)
    })
  cy.visit('/')
})
