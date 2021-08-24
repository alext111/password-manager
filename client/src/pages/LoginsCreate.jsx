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

//generate and encrypt password for new website
class LoginsCreate extends Component {
    
    constructor(props) {
        super(props)
        this.state = { url: '' }
    }

    handleChangeUrl = async event => {
        const url = event.target.value
        this.setState({ url })
    }

    //handle generate password button click
    handleGenerateLogins = async () => {
        const { url } = this.state
        const payload = { url }

        //check if login info already exists, else creates new login info
        try {
            await api.getLoginByUrl(url).then(res => {
                window.alert('Login information already exists')
            })
        }
        catch {
            api.postLogin(payload).then(res => {
                window.alert('Login information successfully created')
                this.setState({ url: ''})
                })
            }
    }
    
    render() {
        const { url } = this.state
        return (
            <Wrapper>
                <Title>
                    Create Password
                </Title>
                <Label>
                    Url/Website
                </Label>
                <InputText
                    type="text"
                    placeholder="e.g. http://google.com"
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