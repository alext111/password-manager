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

class LoginsFindByWebsite extends Component {
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
        const logins = await api.getLoginByWebsite(website)
        const password = await api.decryptPassword(logins.data.data.pw, logins.data.data.iv)
        window.alert('Login information successfully found')
        this.setState({ 
            pw: password.data.data,
        })

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

                <Label>
                    Password
                </Label>
                <br></br>
                <OutputText>
                    {pw}
                </OutputText>
                <br></br>

                <Button onClick={this.handleFindPassword}>
                    Find Password
                </Button>
                <CancelButton href={'/logins/all'}>
                    Cancel
                </CancelButton>
            </Wrapper>
        )
    }
}

export default LoginsFindByWebsite