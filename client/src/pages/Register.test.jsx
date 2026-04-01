/**
 * Register.test.jsx
 * ---------------------------------------------------------
 * Unit tests for the Register Page component
 *
 * Responsibilities:
 * - Ensure register form renders correctly
 * - Verify user can type into fields
 * - Test alerts for validation errors
 * - Test successful register redirects to login
 * - Test failed register shows error alert
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Register from './Register'
import api from '../api'

jest.mock('../api')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Register Page', () => {

    test('renders register form', () => {
        render(<Register />)

        expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument()
        expect(screen.getByLabelText('Username')).toBeInTheDocument()
        expect(screen.getByLabelText('Password')).toBeInTheDocument()
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Cancel' })).toBeInTheDocument()
    })

    test('user can type into input fields', async () => {
        render(<Register />)

        const usernameInput = screen.getByLabelText('Username')
        const passwordInput = screen.getByLabelText('Password')
        const confirmPasswordInput = screen.getByLabelText('Confirm Password')

        await userEvent.type(usernameInput, 'newuser')
        await userEvent.type(passwordInput, 'password123')
        await userEvent.type(confirmPasswordInput, 'password123')

        expect(usernameInput.value).toBe('newuser')
        expect(passwordInput.value).toBe('password123')
        expect(confirmPasswordInput.value).toBe('password123')
    })

    test('shows alert if username or password missing', async () => {
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

        render(<Register />)

        await userEvent.click(screen.getByRole('button', { name: 'Register' }))

        expect(alertSpy).toHaveBeenCalledWith('Username and password required')

        alertSpy.mockRestore()
    })

    test('shows alert if password too short', async () => {
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

        render(<Register />)

        await userEvent.type(screen.getByLabelText('Username'), 'newuser')
        await userEvent.type(screen.getByLabelText('Password'), '123')
        await userEvent.type(screen.getByLabelText('Confirm Password'), '123')

        await userEvent.click(screen.getByRole('button', { name: 'Register' }))

        expect(alertSpy).toHaveBeenCalledWith('Password must be at least 6 characters')

        alertSpy.mockRestore()
    })

    test('shows alert if passwords do not match', async () => {
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

        render(<Register />)

        await userEvent.type(screen.getByLabelText('Username'), 'newuser')
        await userEvent.type(screen.getByLabelText('Password'), 'password123')
        await userEvent.type(screen.getByLabelText('Confirm Password'), 'different123')

        await userEvent.click(screen.getByRole('button', { name: 'Register' }))

        expect(alertSpy).toHaveBeenCalledWith('Passwords do not match')

        alertSpy.mockRestore()
    })

    test('successful register redirects to login', async () => {
        api.registerUser.mockResolvedValue({})

        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

        delete window.location
        window.location = { href: '' }

        render(<Register />)

        await userEvent.type(screen.getByLabelText('Username'), 'newuser')
        await userEvent.type(screen.getByLabelText('Password'), 'password123')
        await userEvent.type(screen.getByLabelText('Confirm Password'), 'password123')

        await userEvent.click(screen.getByRole('button', { name: 'Register' }))

        await waitFor(() => {
            expect(api.registerUser).toHaveBeenCalledWith({
                username: 'newuser',
                password: 'password123'
            })
        })

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('User created successfully')
        })

        await waitFor(() => {
            expect(window.location.href).toBe('/login')
        })

        alertSpy.mockRestore()
    })

    test('failed register shows error alert', async () => {
        api.registerUser.mockRejectedValue(new Error('User exists'))

        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

        render(<Register />)

        await userEvent.type(screen.getByLabelText('Username'), 'existinguser')
        await userEvent.type(screen.getByLabelText('Password'), 'password123')
        await userEvent.type(screen.getByLabelText('Confirm Password'), 'password123')

        await userEvent.click(screen.getByRole('button', { name: 'Register' }))

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Username already exists')
        })

        alertSpy.mockRestore()
    })

})