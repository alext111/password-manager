/**
 * CredentialsFindAll.test.jsx
 * ---------------------------------------------------------
 * Unit tests for the CredentialsFindAll Page component
 *
 * Responsibilities:
 * - Ensure that the login table renders correctly with data
 * - Verify that the component behaves correctly when there are no credentials
 * - Test the "Show Password" button triggers decryption and displays an alert
 * - Test the "Delete" button calls the API and reloads the page when confirmed
 */


import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CredentialsFindAll from './CredentialsFindAll'
import api from '../api'

// Mock the api module
jest.mock('../api')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('CredentialsFindAll', () => {

  /**
   * Test: Table renders correctly when credentials exist
   * - Mocks API to return a single login
   * - Checks that website, "Show Password", and "Delete" buttons appear
   */
  test('renders table with credential data', async () => {
    api.getCredentials.mockResolvedValue({
      data: {
        data: [
          {
            website: 'test.com',
            pw: 'testpw',
            iv: 'testiv',
            salt: 'testsalt'
          }
        ]
      }
    })

    render(<CredentialsFindAll />)

    expect(await screen.findByText('test.com')).toBeInTheDocument()
    expect(screen.getByText('Show Password')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  /**
   * Test: Component renders empty state when no credentials exist
   * - Mocks API to return an empty array
   * - Checks that the table element is not present
   */
  test('renders empty state when no credentials exist', async () => {
    api.getCredentials.mockResolvedValue({
      data: { data: [] }
    })

    render(<CredentialsFindAll />)

    await waitFor(() =>
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    )
  })

  /**
   * Test: Decrypt button calls API and shows alert
   * - Mocks API to return one login and the decryptPassword response
   * - Spies on window.alert to verify correct message
   * - Simulates user clicking "Show Password"
   */
  test('decrypt button calls api and shows alert', async () => {
    api.getCredentials.mockResolvedValue({
      data: {
        data: [
          {
            website: 'test.com',
            pw: 'testpw',
            iv: 'testiv',
            salt: 'testsalt'
          }
        ]
      }
    })

    api.decryptPassword.mockResolvedValue({
      data: { data: 'decrypted-password' }
    })

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(<CredentialsFindAll />)

    const button = await screen.findByText('Show Password')
    userEvent.click(button)

    expect(api.decryptPassword).toHaveBeenCalledWith('test.com')

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('decrypted-password')
    )

    alertSpy.mockRestore()
  })

  /**
   * Test: Delete button calls API when confirmed
   * - Mocks API to return one login
   * - Spies on window.confirm to simulate user confirmation
   * - Mocks window.location.reload to avoid actual reload
   * - Simulates user clicking "Delete" button
   */
  test('delete button calls api when confirmed', async () => {
    api.getCredentials.mockResolvedValue({
      data: {
        data: [
          {
            website: 'test.com',
            pw: 'testpw',
            iv: 'testiv',
          }
        ]
      }
    })

    api.deleteCredentials.mockResolvedValue({})

    jest.spyOn(window, 'confirm').mockReturnValue(true)

    // Mock reload
    const originalLocation = window.location
    delete window.location
    window.location = { reload: jest.fn() }

    render(<CredentialsFindAll />)

    const deleteButton = await screen.findByText('Delete')
    userEvent.click(deleteButton)

    await waitFor(() => expect(api.deleteCredentials).toHaveBeenCalledWith('test.com'))
    await waitFor(() => expect(window.location.reload).toHaveBeenCalled())

    window.location = originalLocation
  })
})