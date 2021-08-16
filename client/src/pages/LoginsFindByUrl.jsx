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

class LoginsFindByUrl extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            url: '', 
            pw: '', 
        }
    }

    handleChangeUrl = async event => {
        const url = event.target.value
        this.setState({ url })
    }

    handleFindPassword = async () => {
        console.log(this.state)

        const url = this.state.url

        const logins = await api.getLoginByUrl(url)
        window.alert('Login Information Successfully Found')
        console.log(logins)
        this.setState({ 
            pw: logins.data.data.pw,
        })
        console.log(this.state)

    }

    

    render() {
        const { url, pw } = this.state
        return (
            <Wrapper>
                <Title>
                    Find Password
                </Title>
                <Label>
                    Url
                </Label>
                <InputText
                    type="text"
                    placeholder="e.g. http://google.com"
                    value={url}
                    onChange={this.handleChangeUrl}
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
                <CancelButton href={'/urls/all'}>
                    Cancel
                </CancelButton>
            </Wrapper>
        )
    }
}

export default LoginsFindByUrl