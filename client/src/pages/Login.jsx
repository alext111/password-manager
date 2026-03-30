/**
 * User login page
 */

import React, { Component } from 'react'
import api from '../api'
import styled from 'styled-components'

// Styled components
const Title = styled.h1.attrs({
    classname: 'h1',
})``

const Wrapper = styled.div.attrs({
    classname: 'form-group',
})`
    margin: 0 30px;
`

const Label = styled.label`
    display: inline-block;
    margin: 5px;
    font-size: 24px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
    width: 800px;
`

const Button = styled.button.attrs({
    className: 'btn btn-primary',
})`
    margin: 15px 15px 15px 5px;
`

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: ''
        }
    }

    handleChangeUsername = async event => {
        const username = event.target.value
        this.setState({ username })
    }

    handleChangePassword = async event => {
        const password = event.target.value
        this.setState({ password })
    }

    handleLogin = async () => {
        const { username, password } = this.state
        const payload = { username, password }

        if (!username || !password) {
            return window.alert('Please enter username and password')
        }

        try {
            const res = await api.loginUser(payload)

            // Save token to localStorage
            localStorage.setItem('token', res.data.token)

            window.alert('Login successful')

            // Redirect to main page
            window.location.href = '/credentials/all'
        } catch (err) {
            window.alert('Invalid username or password')
        }
    }

    render() {
        const { username, password } = this.state

        return (
            <Wrapper>
                <Title>Login</Title>

                <Label>Username</Label>
                <InputText
                    type="text"
                    value={username}
                    onChange={this.handleChangeUsername}
                />

                <Label>Password</Label>
                <InputText
                    type="password"
                    value={password}
                    onChange={this.handleChangePassword}
                />

                <Button onClick={this.handleLogin}>
                    Login
                </Button>
            </Wrapper>
        )
    }
}

export default Login