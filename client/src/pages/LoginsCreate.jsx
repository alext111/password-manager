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
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
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

class LoginsCreate extends Component {
    
    constructor(props) {
        super(props)
        this.state = { url: '' }
    }

    handleChangeUrl = async event => {
        const url = event.target.value
        this.setState({ url })
    }

    handleGenerateLogins = async () => {
        const { url } = this.state
        const pw = 'testpw'
        const payload = { url, pw }

        await api.putLogin(payload).then(res => {
            window.alert('Login Information Successfully Created')
            this.setState({ url: ''})
        })
    }

    render() {
        const { url } = this.state
        return (
            <Wrapper>
                <Title>
                    Create Password
                </Title>
                <Label>
                    Url
                </Label>
                <InputText
                    type="text"
                    value={url}
                    onChange={this.handleChangeUrl}
                />
                <Button onClick={this.handleGenerateLogins}>
                    Generate Password
                </Button>
                <CancelButton href={'/urls/all'}>
                    Cancel
                </CancelButton>
            </Wrapper>
        )
    }

}

export default LoginsCreate