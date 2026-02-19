/**
 * LoginsCreate.test.jsx
 * ---------------------------------------------------------
 * Tests for the LoginsCreate Page Component
 *
 * Responsibilities Tested:
 * - Website input updates correctly as the user types
 * - "Generate Password" button creates a new login when website does not exist
 * - "Generate Password" button shows alert if login already exists
 * - Form state resets after successful creation
 * - Cancel button navigates to the logins list page
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginsCreate from './LoginsCreate'
import api from '../api'

jest.mock('../api')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('LoginsCreate', () => {

  /**
   * Test: Input updates
   * Ensures that typing into the website input correctly updates its value
   */
  test('updates website input as user types', async () => {
    render(<LoginsCreate />)

    const input = screen.getByPlaceholderText('e.g. Google')
    userEvent.type(input, 'example.com')

    expect(input.value).toBe('example.com')
  })

  /**
   * Test: Successful login creation
   * Mocks API to simulate website not found (rejected promise)
   * Verifies that postLogin is called, alert is shown, and input is cleared
   */
  test('creates login successfully when website does not exist', async () => {
    api.getLoginByWebsite.mockRejectedValue({})
    api.postLogin.mockResolvedValue({})

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(<LoginsCreate />)

    const input = screen.getByPlaceholderText('e.g. Google')
    userEvent.type(input, 'example.com')

    const button = screen.getByText('Generate Password')
    userEvent.click(button)

    await waitFor(() => expect(api.postLogin).toHaveBeenCalledWith({ website: 'example.com' }))
    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('Login information successfully created'))
    expect(input.value).toBe('')

    alertSpy.mockRestore()
  })

  /**
   * Test: Existing login
   * Mocks API to simulate website already exists (resolved promise)
   * Verifies that getLoginByWebsite is called and the correct alert is shown
   */
  test('shows alert if login already exists', async () => {
    api.getLoginByWebsite.mockResolvedValue({})

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(<LoginsCreate />)

    const input = screen.getByPlaceholderText('e.g. Google')
    userEvent.type(input, 'example.com')

    const button = screen.getByText('Generate Password')
    userEvent.click(button)

    await waitFor(() => expect(api.getLoginByWebsite).toHaveBeenCalledWith('example.com'))
    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('Login information already exists'))

    alertSpy.mockRestore()
  })

  /**
   * Test: Cancel button navigation
   * Verifies that the Cancel button points to the correct href (/logins/all)
   */
  test('Cancel button navigates to /logins/all', () => {
    render(<LoginsCreate />)

    const cancelButton = screen.getByText('Cancel')
    expect(cancelButton).toHaveAttribute('href', '/logins/all')
  })

})
