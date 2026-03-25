/**
 * CredentialsCreate.test.jsx
 * ---------------------------------------------------------
 * Unit tests for the CredentialsCreate Page Component
 *
 * Responsibilities:
 * - Website input updates correctly as the user types
 * - "Generate Password" button creates new credentials when website does not exist
 * - "Generate Password" button shows alert if credentials already exists
 * - Form state resets after successful creation
 * - Cancel button navigates to the credentials list page
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CredentialsCreate from './CredentialsCreate'
import api from '../api'

jest.mock('../api')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('CredentialsCreate', () => {

  /**
   * Test: Input updates
   * Ensures that typing into the website input correctly updates its value
   */
  test('updates website input as user types', async () => {
    render(<CredentialsCreate />)

    const input = screen.getByPlaceholderText('e.g. Google')
    userEvent.type(input, 'example.com')

    expect(input.value).toBe('example.com')
  })

  /**
   * Test: Successful credentials creation
   * Mocks API to simulate website not found (rejected promise)
   * Verifies that postCredentials is called, alert is shown, and input is cleared
   */
  test('creates credentials successfully when website does not exist', async () => {
    api.getCredentialsByWebsite.mockRejectedValue({})
    api.postCredentials.mockResolvedValue({})

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(<CredentialsCreate />)

    const input = screen.getByPlaceholderText('e.g. Google')
    userEvent.type(input, 'example.com')

    const button = screen.getByText('Generate Password')
    userEvent.click(button)

    await waitFor(() => expect(api.postCredentials).toHaveBeenCalledWith({ website: 'example.com' }))
    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('Credentials successfully created'))
    expect(input.value).toBe('')

    alertSpy.mockRestore()
  })

  /**
   * Test: Existing credentials
   * Mocks API to simulate website already exists (resolved promise)
   * Verifies that getCredentialsByWebsite is called and the correct alert is shown
   */
  test('shows alert if credentials already exists', async () => {
    api.getCredentialsByWebsite.mockResolvedValue({})

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(<CredentialsCreate />)

    const input = screen.getByPlaceholderText('e.g. Google')
    userEvent.type(input, 'example.com')

    const button = screen.getByText('Generate Password')
    userEvent.click(button)

    await waitFor(() => expect(api.getCredentialsByWebsite).toHaveBeenCalledWith('example.com'))
    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('Credentials already exists'))

    alertSpy.mockRestore()
  })

  /**
   * Test: Cancel button navigation
   * Verifies that the Cancel button points to the correct href (/credentialss/all)
   */
  test('Cancel button navigates to /credentials/all', () => {
    render(<CredentialsCreate />)

    const cancelButton = screen.getByText('Cancel')
    expect(cancelButton).toHaveAttribute('href', '/credentials/all')
  })

})
