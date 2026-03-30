/**
 * Application Root Component
 * ---------------------------------------------------------
 * Configures client-side routing and global layout
 *
 * Responsibilities:
 * - Initialize React Router
 * - Define application routes
 * - Render persistent navigation (NavBar)
 * - Load global styles (Bootstrap)
 */

import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NavBar } from '../components'
import { CredentialsCreate, CredentialsFindByWebsite, CredentialsFindAll, CredentialsUpdate, Login, Register } from '../pages'


import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <Router>
      {/* Persistent navigation bar across all routes */}
      <NavBar/>
      
      {/* Route configuration */}
      <Switch>
        <Route path="/credentials/create" exact component={CredentialsCreate} />
        <Route path="/credentials/find/" exact component={CredentialsFindByWebsite} />
        <Route path="/credentials/all" exact component={CredentialsFindAll} />
        <Route path="/credentials/update/" exact component={CredentialsUpdate} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
      </Switch>
    </Router>
  )
}

export default App
