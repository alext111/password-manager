/**
 * Links Component
 * ---------------------------------------------------------
 * Renders the navigation links in the application NavBar.
 *
 * Responsibilities:
 * - Display main navigation links for all pages
 * - Use React Router <Link> for client-side routing
 * - Apply styling via styled-components
 *
 * Notes:
 * - Collapse, List, and Item are styled divs for Bootstrap navbar layout
 * - This component is used inside NavBar
 */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { isAuthenticated, logout } from '../utils/auth'

// Styled components for Bootstrap navbar structure
const Collapse = styled.div.attrs({
    className: 'collapse navbar-collapse',
})``

const List = styled.div.attrs({
    className: 'navbar-nav mr-auto',
})``

const Item = styled.div.attrs({
    className: 'collapse navbar-collapse',
})``

class Links extends Component {
    render() {
        const loggedIn = isAuthenticated()

        return (
            <React.Fragment>
                <Link to="/" className="navbar-brand">
                    Password Manager
                </Link>
                <Collapse>
                    <List>
                        {loggedIn && (
                            <>
                                <Item>
                                    <Link to="/credentials/create" className="nav-link">
                                        Create Password
                                    </Link>
                                </Item>
                                <Item>
                                    <Link to="/credentials/find" className="nav-link">
                                        Find Password By Url
                                    </Link>
                                </Item>
                                <Item>
                                    <Link to="/credentials/all" className="nav-link">
                                        Find All Logins
                                    </Link>
                                </Item>
                                <Item>
                                    <Link to="/credentials/update" className="nav-link">
                                        Update Password
                                    </Link>
                                </Item>
                                <Item>
                                    <Link to="/login" className="nav-link" onClick={() => {
                                        logout()
                                    }}>
                                        Logout
                                    </Link>
                                </Item>
                                </>
                        )}

                        {!loggedIn && (
                            <>
                                <Item>
                                    <Link to="/login" className="nav-link">
                                        Login
                                    </Link>
                                </Item>
                                <Item>
                                    <Link to="/register" className="nav-link">
                                        Register New User
                                    </Link>
                                </Item>
                            </>
                        )}
                    </List>
                </Collapse>
            </React.Fragment>
        )
    }
}

export default Links