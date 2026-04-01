/**
 * Login.test.jsx
 * ---------------------------------------------------------
 * Unit tests for the Login Page component
 *
 * Responsibilities:
 * - Ensure login form renders correctly
 * - Verify user can type into username and password fields
 * - Test alert when fields are empty
 * - Test successful login stores token and redirects
 * - Test failed login shows error alert
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from './Login'
import api from '../api'

// Mock the api module
jest.mock('../api')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Login Page', () => {

    test('renders login form', () => {
        render(<Login />)

        expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
        expect(screen.getByLabelText('Username')).toBeInTheDocument()
        expect(screen.getByLabelText('Password')).toBeInTheDocument()
    })

    test('user can type into input fields', async () => {
        render(<Login />)

        const usernameInput = screen.getByLabelText('Username')
        const passwordInput = screen.getByLabelText('Password')

        await userEvent.type(usernameInput, 'testuser')
        await userEvent.type(passwordInput, 'password123')

        expect(usernameInput.value).toBe('testuser')
        expect(passwordInput.value).toBe('password123')
    })

    test('shows alert if fields are empty', async () => {
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

        render(<Login />)

        const button = screen.getByRole('button', { name: 'Login' })
        userEvent.click(button)

        expect(alertSpy).toHaveBeenCalledWith('Please enter username and password')

        alertSpy.mockRestore()
    })

    test('successful login stores token and redirects', async () => {
        api.loginUser.mockResolvedValue({
            data: { token: 'fake-jwt-token' }
        })

        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

        // Mock window.location
        delete window.location
        window.location = { href: '' }

        render(<Login />)

        await userEvent.type(screen.getByLabelText('Username'), 'testuser')
        await userEvent.type(screen.getByLabelText('Password'), 'password123')

        userEvent.click(screen.getByRole('button', { name: 'Login' }))

        await waitFor(() => {
            expect(api.loginUser).toHaveBeenCalledWith({
            username: 'testuser',
            password: 'password123'
            })
        })

        await waitFor(() => {
            expect(localStorage.getItem('token')).toBe('fake-jwt-token')
        })

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Login successful')
        })

        await waitFor(() => {
            expect(window.location.href).toBe('/credentials/all')
        })

        alertSpy.mockRestore()
    })

    test('failed login shows error alert', async () => {
        api.loginUser.mockRejectedValue(new Error('Invalid login'))

        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

        render(<Login />)

        await userEvent.type(screen.getByLabelText('Username'), 'wronguser')
        await userEvent.type(screen.getByLabelText('Password'), 'wrongpassword')

        userEvent.click(screen.getByRole('button', { name: 'Login' }))

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Invalid username or password')
        })

        alertSpy.mockRestore()
    })
})