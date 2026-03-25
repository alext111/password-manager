/**
 * CredentialsCreate Page Component
 * ---------------------------------------------------------
 * Provides a form for creating new login credentials for a website.
 *
 * Responsibilities:
 * - Capture website input from the user
 * - Check if login information already exists
 * - Generate and encrypt a password using the backend API
 * - Provide feedback to the user via alerts
 * - Reset form state after successful creation
 *
 * Notes:
 * - Uses styled-components for consistent layout and Bootstrap styling
 * - Interacts with the API layer (../api) for CRUD operations
 * - Navigation via Cancel button returns to the "Find All Credentials" page
 */

import React, { Component } from 'react'
import api from '../api'
import styled from 'styled-components'

// Styled components for layout and form elements
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

//generate and encrypt password for new website
class CredentialsCreate extends Component {
    
    constructor(props) {
        super(props)
        this.state = { website: '' }
    }

    // Update website state as user types
    handleChangeWebsite = async event => {
        const website = event.target.value
        this.setState({ website })
    }

    // Handle the "Generate Password" button click
    handleGenerateCredentials = async () => {
        const { website } = this.state
        const payload = { website }

        if (!website) {
            return window.alert('Please enter a website')
        }

        // Check if credentials already exists
        try {
            await api.getCredentialsByWebsite(website).then(res => {
                window.alert('Credentials already exists')
            })
        }
        catch {
            // If not, create new login info
            api.postCredentials(payload).then(res => {
                window.alert('Credentials successfully created')
                this.setState({ website: ''})
                })
            }
    }
    
    render() {
        const { website } = this.state
        return (
            <Wrapper>
                <Title>
                    Create Password
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
                <Button onClick={this.handleGenerateCredentials}>
                    Generate Password
                </Button>
                <CancelButton href={'/credentials/all'}>
                    Cancel
                </CancelButton>
            </Wrapper>
        )
    }

}

export default CredentialsCreate