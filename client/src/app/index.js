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
import { LoginsCreate, LoginsFindByWebsite, LoginsFindAll, LoginsUpdate } from '../pages'


import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <Router>
      {/* Persistent navigation bar across all routes */}
      <NavBar/>
      
      {/* Route configuration */}
      <Switch>
        <Route path="/login/create" exact component={LoginsCreate} />
        <Route path="/login/find/" exact component={LoginsFindByWebsite} />
        <Route path="/logins/all" exact component={LoginsFindAll} />
        <Route path="/login/update/" exact component={LoginsUpdate} />
      </Switch>
    </Router>
  )
}

export default App
