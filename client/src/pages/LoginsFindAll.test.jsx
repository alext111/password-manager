/**
 * LoginsFindAll.test.jsx
 * ---------------------------------------------------------
 * Unit tests for the LoginsFindAll React component.
 *
 * Responsibilities:
 * - Ensure that the login table renders correctly with data
 * - Verify that the component behaves correctly when there are no logins
 * - Test the "Show Password" button triggers decryption and displays an alert
 * - Test the "Delete" button calls the API and reloads the page when confirmed
 *
 * Notes:
 * - Uses Jest for test runner and mocks
 * - Uses React Testing Library for DOM rendering and interaction
 * - `api` module is mocked to avoid real HTTP requests
 */


import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginsFindAll from './LoginsFindAll'
import api from '../api'

// Mock the api module
jest.mock('../api')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('LoginsFindAll', () => {

  /**
   * Test: Table renders correctly when logins exist
   * - Mocks API to return a single login
   * - Checks that website, "Show Password", and "Delete" buttons appear
   */
  test('renders table with login data', async () => {
    api.getLogins.mockResolvedValue({
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

    render(<LoginsFindAll />)

    expect(await screen.findByText('test.com')).toBeInTheDocument()
    expect(screen.getByText('Show Password')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  /**
   * Test: Component renders empty state when no logins exist
   * - Mocks API to return an empty array
   * - Checks that the table element is not present
   */
  test('renders empty state when no logins exist', async () => {
    api.getLogins.mockResolvedValue({
      data: { data: [] }
    })

    render(<LoginsFindAll />)

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
    api.getLogins.mockResolvedValue({
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

    api.decryptPassword.mockResolvedValue({
      data: { data: 'decrypted-password' }
    })

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(<LoginsFindAll />)

    const button = await screen.findByText('Show Password')
    userEvent.click(button)

    expect(api.decryptPassword).toHaveBeenCalledWith('testpw', 'testiv')

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
    api.getLogins.mockResolvedValue({
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

    api.deleteLogin.mockResolvedValue({})

    jest.spyOn(window, 'confirm').mockReturnValue(true)

    // Mock reload
    const originalLocation = window.location
    delete window.location
    window.location = { reload: jest.fn() }

    render(<LoginsFindAll />)

    const deleteButton = await screen.findByText('Delete')
    userEvent.click(deleteButton)

    await waitFor(() => expect(api.deleteLogin).toHaveBeenCalledWith('test.com'))
    await waitFor(() => expect(window.location.reload).toHaveBeenCalled())

    window.location = originalLocation
  })
})