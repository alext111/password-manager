/**
 * CredentialsUpdate Page Component
 * ---------------------------------------------------------
 * Provides a form to update the password for a specific website.
 *
 * Responsibilities:
 * - Capture website and new password input from the user
 * - Send update request to the backend API
 * - Encrypt the new password server-side
 * - Provide user feedback via window alerts
 * - Reset form state after successful update
 *
 * Notes:
 * - Uses styled-components for layout and Bootstrap styling
 * - Cancel button navigates back to the "Find All Credentials" page
 * - Ensures password management functionality is clear and modular
 */

import React, { Component } from 'react'
import api from '../api'
import styled from 'styled-components'

// Styled components for layout and form controls
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

class CredentialsUpdate extends Component {
    
    constructor(props) {
        super(props)
        this.state = { website: '', pw: '' }
    }

    handleChangeWebsite = async event => {
        const website = event.target.value
        this.setState({ website })
    }

    handleChangePassword = async event => {
        const pw = event.target.value
        this.setState({ pw })
    }

    handleUpdatePassword = async () => {
        const { website, pw } = this.state
        const payload = { website, pw }

        await api.updateCredentials(website, payload).then(res => {
            window.alert('Password successfully changed and encrypted.')
            this.setState({ website: '', pw: ''})
        })
    }

    render() {
        const { website, pw } = this.state
        return (
            <Wrapper>
                <Title>
                    Change Password
                </Title>
                <Label>
                    Website
                </Label>
                <InputText
                    type="text"
                    placeholder="e.g. Google"
                    value={website}
                    onChange={this.handleChangeWebsite}
                />

                <Label>
                    New Password
                </Label>
                <InputText
                    type="text"
                    placeholder="e.g. examplepassword"
                    value={pw}
                    onChange={this.handleChangePassword}
                />

                <Button onClick={this.handleUpdatePassword}>
                    Update Password
                </Button>
                <CancelButton href={'/credentials/all'}>
                    Cancel
                </CancelButton>
            </Wrapper>
        )
    }

}

export default CredentialsUpdate