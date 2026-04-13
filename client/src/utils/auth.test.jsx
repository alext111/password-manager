/**
 * auth.test.js
 * ---------------------------------------------------------
 * Unit tests for authentication utility functions
 *
 * Responsibilities:
 * - Validates isAuthenticated token detection
 * - Validates logout clears token and redirects
 */
import { isAuthenticated, logout } from './auth'

beforeEach(() => {
  localStorage.clear()
  delete window.location
  window.location = { href: '' }
})

describe('Auth Utils', () => {
  /**
   * Test: isAuthenticated - no token
   */
  test('isAuthenticated returns false when no token exists', () => {
    expect(isAuthenticated()).toBe(false)
  })

  /**
   * Test: isAuthenticated - token present
   */
  test('isAuthenticated returns true when token exists', () => {
    localStorage.setItem('token', 'test-token')
    expect(isAuthenticated()).toBe(true)
  })

  /**
   * Test: logout - clears token
   */
  test('logout removes token from localStorage', () => {
    localStorage.setItem('token', 'test-token')
    logout()
    expect(localStorage.getItem('token')).toBeNull()
  })

  /**
   * Test: logout - redirects to login
   */
  test('logout redirects to /login', () => {
    logout()
    expect(window.location.href).toBe('/login')
  })
})