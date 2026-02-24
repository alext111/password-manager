/**
 * LoginsFindAll Page Component
 * ---------------------------------------------------------
 * Displays all saved login credentials in a table format.
 *
 * Responsibilities:
 * - Fetch all login information from the backend API
 * - Render a sortable and filterable table using @tanstack/react-table
 * - Provide actions for:
 *   - Decrypting passwords for a specific login
 *   - Deleting a login entry
 *
 * Notes:
 * - DecryptPassword and DeleteLogin are child components handling user interactions
 * - Styled-components are used for layout and cursor styling
 * - Window alerts and confirm dialogs are used for user feedback
 */

import React, { useEffect, useState } from 'react'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import api from '../api'
import styled from 'styled-components'

// Styled components for layout and form controls
const Wrapper = styled.div`
  padding: 0 20px 20px 20px;
`

const Decrypt = styled.div`
  cursor: pointer;
  color: #007bff;
  &:hover {
    text-decoration: underline;
  }
`

const Delete = styled.div`
  cursor: pointer;
  color: #dc3545;
  &:hover {
    text-decoration: underline;
  }
`

// Child component: decrypt password for a login
const DecryptPassword = ({ pw, iv }) => {
  const decryptPassword = async () => {
    const res = await api.decryptPassword(pw, iv)
    window.alert(res.data.data)
  }
  return <Decrypt onClick={decryptPassword}>Show Password</Decrypt>
}

// Child component: delete a login entry
const DeleteLogin = ({ website }) => {
  const deleteLogin = async () => {
    if (window.confirm(`Do you want to delete ${website} login information?`)) {
      await api.deleteLogin(website)
      window.location.reload()
    }
  }
  return <Delete onClick={deleteLogin}>Delete</Delete>
}

// Main component: displays all logins in a table
const LoginsFindAll = () => {
  const [logins, setLogins] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch all logins from backend on component mount
  useEffect(() => {
    const fetchLogins = async () => {
      setIsLoading(true)
      const res = await api.getLogins()
      setLogins(res.data.data)
      setIsLoading(false)
    }
    fetchLogins()
  }, [])

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  const columnHelper = createColumnHelper()

  // Define table columns including action buttons
  const columns = [
    columnHelper.accessor('website', { header: 'Website' }),
    columnHelper.accessor('pw', { header: 'Encrypted Password' }),
    columnHelper.accessor('updatedAt', {
      header: 'Last Updated',
      cell: info => formatDate(info.getValue()),
    }),
    columnHelper.display({
      id: 'decrypt',
      cell: info => <DecryptPassword pw={info.row.original.pw} iv={info.row.original.iv} />,
    }),
    columnHelper.display({
      id: 'delete',
      cell: info => <DeleteLogin website={info.row.original.website} />,
    }),
  ]

  // Initialize the table with rows, columns, and row model
  const table = useReactTable({
    data: logins,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Wrapper>
      {logins.length > 0 && (
        <table className="table table-striped table-bordered table-hover">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : typeof header.column.columnDef.header === 'function'
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                    {typeof cell.column.columnDef.cell === 'function'
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.getValue()}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
      )}
    </Wrapper>
  )
}


export default LoginsFindAll