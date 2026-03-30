/**
 * Register new user page
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

const CancelButton = styled.a.attrs({
    className: 'btn btn-danger',
})`
    margin: 15px 15px 15px 5px;
`

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            confirmPassword: ''
        }
    }

    handleChangeUsername = event => {
        this.setState({ username: event.target.value })
    }

    handleChangePassword = event => {
        this.setState({ password: event.target.value })
    }

    handleChangeConfirmPassword = event => {
        this.setState({ confirmPassword: event.target.value })
    }

    handleRegister = async () => {
        const { username, password, confirmPassword } = this.state

        if (!username || !password) {
            return window.alert('Username and password required')
        }

        if (password.length < 6) {
            return window.alert('Password must be at least 6 characters')
        }

        if (password !== confirmPassword) {
            return window.alert('Passwords do not match')
        }

        try {
            await api.registerUser({ username, password })
            window.alert('User created successfully')
            window.location.href = '/login'
        } catch (err) {
            window.alert('Username already exists')
        }
    }

    render() {
        const { username, password, confirmPassword } = this.state

        return (
            <Wrapper>
                <Title>Register</Title>

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

                <Label>Confirm Password</Label>
                <InputText
                    type="password"
                    value={confirmPassword}
                    onChange={this.handleChangeConfirmPassword}
                />

                <Button onClick={this.handleRegister}>
                    Register
                </Button>

                <CancelButton href={'/login'}>
                    Cancel
                </CancelButton>
            </Wrapper>
        )
    }
}

export default Register