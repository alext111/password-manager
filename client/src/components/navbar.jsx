import React, { Component } from 'react'
import Links from './links'
import styled from 'styled-components'

const Container = styled.div.attrs({
    className: 'container',
})``

const Nav = styled.nav.attrs({
    className: 'navbar navbar-expand-lg navbar-dark bg-dark',
})``

class NavBar extends Component {
    render() {
        return (
            <Container>
                <Nav>
                    <Links />
                </Nav>
            </Container>
        )
    }
}

export default NavBar