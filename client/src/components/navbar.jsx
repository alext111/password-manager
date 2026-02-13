/**
 * NavBar Component
 * ---------------------------------------------------------
 * Provides the top navigation bar for the application.
 *
 * Responsibilities:
 * - Render the main navigation container and styling
 * - Include the Links component for page navigation
 * - Apply Bootstrap and styled-components layout
 *
 * Notes:
 * - Uses Container and Nav styled divs to structure layout
 * - Links component handles individual navigation links
 */

import React, { Component } from 'react'
import Links from './links'
import styled from 'styled-components'

// Container for proper Bootstrap layout
const Container = styled.div.attrs({
    className: 'container',
})``

// Navbar element with Bootstrap styling
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