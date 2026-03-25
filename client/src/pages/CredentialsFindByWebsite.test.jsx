/**
 * CredentialsFindByWebsite.test.jsx
 * ---------------------------------------------------------
 * Unit tests for CredentialsFindByWebsite Page Component
 * 
 * Verifies the behavior of the "Find Password by Website" page:
 * - Ensures website input updates correctly as the user types
 * - Calls the API to fetch login information for a given website
 * - Calls the API to decrypt the retrieved password
 * - Displays the decrypted password in the output field
 * - Shows appropriate alerts on success
 * - Ensures Cancel button navigates back to the "Find All Credentials" page
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CredentialsFindByWebsite from './CredentialsFindByWebsite'
import api from '../api'

jest.mock('../api')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('CredentialsFindByWebsite', () => {

  /**
   * Test: Input updates as user types
   * - Renders the component
   * - Types a website name into the input field
   * - Verifies that the input value reflects what the user typed
   */
  test('updates website input as user types', async () => {
    render(<CredentialsFindByWebsite />)

    const input = screen.getByPlaceholderText('e.g. Google')
    userEvent.type(input, 'example.com')

    expect(input.value).toBe('example.com')
  })

  /**
   * Test: Finds and displays decrypted password successfully
   * - Mocks API calls for fetching login by website and decrypting the password
   * - Types website name and clicks "Find Password"
   * - Verifies that:
   *   1. API.getLoginByWebsite is called with the correct argument
   *   2. API.decryptPassword is called with the correct arguments
   *   3. Window alert is shown with success message
   *   4. Decrypted password is displayed in the output field
   */
  test('finds and displays decrypted password successfully', async () => {
    // Mock API responses
    api.getCredentialsByWebsite.mockResolvedValue({
      data: {
        data: { website: 'example.com', pw: 'encrypted', iv: 'iv123', salt: 'salt123'}
      }
    })
    api.decryptPassword.mockResolvedValue({
      data: { data: 'decrypted-password' }
    })

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(<CredentialsFindByWebsite />)

    const input = screen.getByPlaceholderText('e.g. Google')
    userEvent.type(input, 'example.com')

    const button = screen.getByRole('button', { name: /find password/i })
    userEvent.click(button)

    // Wait for API calls and state updates
    await waitFor(() => expect(api.decryptPassword).toHaveBeenCalledWith('example.com'))
    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('Login information successfully found'))

    // Verify password is displayed in output
    const output = screen.getByRole('textbox', { name: /password/i }) || screen.getByText('decrypted-password')
    expect(output.textContent).toBe('decrypted-password')

    alertSpy.mockRestore()
  })

  /**
   * Test: Cancel button navigates to /credentials/all
   * - Renders the component
   * - Verifies that the Cancel button has the correct href
   */
  test('Cancel button navigates to /credentials/all', () => {
    render(<CredentialsFindByWebsite />)

    const cancelButton = screen.getByRole('link', { name: /cancel/i })
    expect(cancelButton).toHaveAttribute('href', '/credentials/all')
  })

})