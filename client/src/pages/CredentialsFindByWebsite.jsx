/**
 * CredentialsFindByWebsite Page Component
 * ---------------------------------------------------------
 * Provides a form to search for a saved password by website.
 *
 * Responsibilities:
 * - Capture website input from the user
 * - Fetch login credentials for the specified website from the backend API
 * - Decrypt the password using the API
 * - Display the decrypted password to the user
 * - Reset or update form state after successful retrieval
 *
 * Notes:
 * - Uses styled-components for consistent layout and Bootstrap styling
 * - Window alert used for user feedback
 * - Cancel button navigates back to the "Find All Credentials" page
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

const OutputText = styled.output.attrs({
    className: 'form-control'
})`
    margin: 5px;
    padding: 16px;
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

class CredentialsFindByWebsite extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            website: '', 
            pw: '', 
        }
    }

    handleChangeWebsite = async event => {
        const website = event.target.value
        this.setState({ website })
    }

    handleFindPassword = async () => {
        const website = this.state.website
        if (!website) {
            return window.alert('Please enter a website')
        }

        try {
            // Call backend: GET /api/decrypt/:website
            const res = await api.decryptPassword(website)
            this.setState({ pw: res.data.data })
            window.alert('Login information successfully found')
        } catch (err) {
            console.error(err)
            window.alert('Could not find password for the specified website')
            this.setState({ pw: '' })
        }
    }

    render() {
        const { website, pw } = this.state
        return (
            <Wrapper>
                <Title>
                    Find Password
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

                <Label htmlFor="password-output">
                    Password
                </Label>
                <br></br>
                <OutputText id="password-output" aria-label="Password" role="textbox">
                    {pw}
                </OutputText>
                <br></br>

                <Button onClick={this.handleFindPassword}>
                    Find Password
                </Button>
                <CancelButton href={'/credentials/all'}>
                    Cancel
                </CancelButton>
            </Wrapper>
        )
    }
}

export default CredentialsFindByWebsite