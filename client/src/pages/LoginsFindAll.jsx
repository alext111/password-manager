import React, { Component } from 'react'
import ReactTable from 'react-table-6'
import api from '../api'
import styled from 'styled-components'
import 'react-table-6/react-table.css'


const Wrapper = styled.div`
    padding: 0 20px 20px 20px;
`

const Decrypt = styled.div`
    cursor: pointer;
`

const Delete = styled.div`
    cursor: pointer;
`

//decrypt password and show user in window prompt
class DecryptPassword extends Component {
    decryptPassword = async () => {
        const pw = this.props.pw
        const iv = this.props.iv
        await api.decryptPassword(pw, iv).then(res => {
            window.alert(`${res.data.data}`)
        })
    }

    render () {
        return <Decrypt onClick={this.decryptPassword}>Show Password</Decrypt>
    }
}

//prompt user to delete login info for one website
class DeleteLogin extends Component {
    deleteLogin = async () => {

        if (window.confirm(`Do you want to delete ${this.props.website} login information?`,)) {

            await api.deleteLogin(this.props.website).then(res => {
                window.location.reload()
            })
            
        }
    }

    render () {
        return <Delete onClick={this.deleteLogin}>Delete</Delete>
    }
}

class LoginsFindAll extends Component {
    constructor(props) {
        super(props)
        this.state = {
            logins: [],
            columns: [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getLogins().then(logins => {
            this.setState({
                logins: logins.data.data,
                isLoading: false,
            })
        })
    }
    
    render() {
        const { logins, isLoading } = this.state
        console.log('TCL: LoginsList -> render -> logins', logins)
        
        const columns = [
            {
                Header: 'Website',
                accessor: 'website',
                filterable: true,
            },
            {
                Header: 'Encrypted Password',
                accessor: 'pw',
                filterable: true,
            },
            {
                Header: 'Last Updated',
                accessor: 'updatedAt',
                filterable: true,
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <DecryptPassword website={props.original.website} pw={props.original.pw} iv={props.original.iv} />
                        </span>
                    )
                }
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <DeleteLogin website={props.original.website} />
                        </span>
                    )
                }
            }
        ]

        let showTable = true
        if (!logins.length) {
            showTable = false
        }

        return (
            <Wrapper>
                {showTable && (
                    <ReactTable
                        data={logins}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )}
            </Wrapper>
        )
    }
}

export default LoginsFindAll