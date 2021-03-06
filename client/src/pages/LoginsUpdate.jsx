import React, { Component } from 'react'
import api from '../api'
import styled from 'styled-components'

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

//update password for one website with user chosen password
class LoginsUpdate extends Component {
    
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

        await api.updateLogin(website, payload).then(res => {
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
                <CancelButton href={'/logins/all'}>
                    Cancel
                </CancelButton>
            </Wrapper>
        )
    }

}

export default LoginsUpdate