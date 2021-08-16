import React, { Component } from 'react'
import ReactTable from 'react-table-6'
import api from '../api'
import styled from 'styled-components'
import 'react-table-6/react-table.css'


const Wrapper = styled.div`
    padding: 0 20px 20px 20px;
`

const Delete = styled.div`
    cursor: pointer;
`

class DeleteLogin extends Component {
    deleteLogin = event => {
        event.preventDefault()

        if (window.confirm(`Do you want to delete ${this.props.url} login information?`,)) {
            console.log(this.props.url)
            api.deleteLogin(this.props.url).then(window.location.reload())
            
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
                Header: 'Url',
                accessor: 'url',
                filterable: true,
            },
            {
                Header: 'Password',
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
                            <DeleteLogin url={props.original.url} />
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