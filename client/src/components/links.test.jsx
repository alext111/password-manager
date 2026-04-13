/**
 * Links.test.jsx
 * ---------------------------------------------------------
 * Unit tests for the Links Navigation Component
 *
 * Responsibilities:
 * - Renders application title
 * - Displays correct navigation links
 * - Shows Login/Register when user is not authenticated
 * - Shows Logout when user is authenticated
 */

import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Links from './links'

beforeEach(() => {
  localStorage.clear()
})

describe('Links', () => {

  /**
   * Test: Renders title
   */
  test('renders application title', () => {
    render(
      <BrowserRouter>
        <Links />
      </BrowserRouter>
    )

    expect(screen.getByText('Password Manager')).toBeInTheDocument()
  })

  /**
   * Test: Shows navigation links
   */
  test('renders all navigation links', () => {
    localStorage.setItem('token', 'test-token')
    render(
      <BrowserRouter>
        <Links />
      </BrowserRouter>
    )

    expect(screen.getByText('Create Password')).toBeInTheDocument()
    expect(screen.getByText('Find Password By Website')).toBeInTheDocument()
    expect(screen.getByText('Find All Logins')).toBeInTheDocument()
    expect(screen.getByText('Update Password')).toBeInTheDocument()
  })

  /**
   * Test: Not authenticated
   * Verifies Login and Register are shown, Logout is hidden
   */
  test('shows login and register when not authenticated', () => {
    render(
      <BrowserRouter>
        <Links />
      </BrowserRouter>
    )

    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Register New User')).toBeInTheDocument()
    expect(screen.queryByText('Logout')).toBeNull()
  })

  /**
   * Test: Authenticated
   * Verifies Logout is shown, Login/Register are hidden
   */
  test('shows logout when authenticated', () => {
    localStorage.setItem('token', 'test-token')

    render(
      <BrowserRouter>
        <Links />
      </BrowserRouter>
    )

    expect(screen.getByText('Logout')).toBeInTheDocument()
    expect(screen.queryByText('Login')).toBeNull()
    expect(screen.queryByText('Register')).toBeNull()
  })

})