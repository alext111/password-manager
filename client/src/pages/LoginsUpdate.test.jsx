/**
 * LoginsUpdate.test.jsx
 * ---------------------------------------------------------
 * Unit tests for LoginsUpdate Page Component
 * 
 * Verifies the behavior of the "Update Password" page:
 * - Ensures website and password inputs update correctly
 * - Calls the API to update login information
 * - Shows alerts on successful password update
 * - Clears the input fields after update
 * - Ensures Cancel button navigates back to the "Find All Logins" page
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginsUpdate from './LoginsUpdate'
import api from '../api'

jest.mock('../api')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('LoginsUpdate', () => {

  /**
   * Test: Website input updates correctly
   * - Renders the component
   * - Types a website name into the input field
   * - Verifies input value is updated
   */
  test('updates website input as user types', () => {
    render(<LoginsUpdate />)

    const websiteInput = screen.getByPlaceholderText('e.g. Google')
    userEvent.type(websiteInput, 'example.com')

    expect(websiteInput.value).toBe('example.com')
  })

  /**
   * Test: Password input updates correctly
   * - Renders the component
   * - Types a new password into the input field
   * - Verifies input value is updated
   */
  test('updates password input as user types', () => {
    render(<LoginsUpdate />)

    const passwordInput = screen.getByPlaceholderText('e.g. examplepassword')
    userEvent.type(passwordInput, 'newpassword123')

    expect(passwordInput.value).toBe('newpassword123')
  })

  /**
   * Test: Updates password successfully
   * - Mocks API call to update login
   * - Types website and new password
   * - Clicks "Update Password"
   * - Verifies API is called with correct payload
   * - Verifies alert is shown
   * - Verifies input fields are cleared after success
   */
  test('updates password successfully', async () => {
    api.updateLogin.mockResolvedValue({})

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(<LoginsUpdate />)

    const websiteInput = screen.getByPlaceholderText('e.g. Google')
    const passwordInput = screen.getByPlaceholderText('e.g. examplepassword')
    userEvent.type(websiteInput, 'example.com')
    userEvent.type(passwordInput, 'newpassword123')

    const updateButton = screen.getByRole('button', { name: /update password/i })
    userEvent.click(updateButton)

    await waitFor(() =>
      expect(api.updateLogin).toHaveBeenCalledWith('example.com', { website: 'example.com', pw: 'newpassword123' })
    )
    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('Password successfully changed and encrypted.')
    )

    // Inputs should be cleared after successful update
    expect(websiteInput.value).toBe('')
    expect(passwordInput.value).toBe('')

    alertSpy.mockRestore()
  })

  /**
   * Test: Cancel button navigates to /logins/all
   * - Verifies the Cancel button has correct href
   */
  test('Cancel button navigates to /logins/all', () => {
    render(<LoginsUpdate />)

    const cancelButton = screen.getByRole('link', { name: /cancel/i })
    expect(cancelButton).toHaveAttribute('href', '/logins/all')
  })

})
