import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

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
        return (
            <React.Fragment>
                <Link to="/" className="navbar-brand">
                    Test App
                </Link>
                <Collapse>
                    <List>
                        <Item>
                            <Link to="/url/create" className="nav-link">
                                Create Password
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/url/find" className="nav-link">
                                Find Password By Url
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/urls/all" className="nav-link">
                                Find All Logins
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/url/update" className="nav-link">
                                Update Password
                            </Link>
                        </Item>
                    </List>
                </Collapse>
            </React.Fragment>
        )
    }
}

export default Links