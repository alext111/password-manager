import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NavBar } from '../components'
import { LoginsCreate, LoginsFindByUrl, LoginsFindAll, LoginsUpdate } from '../pages'


import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <Router>
      <NavBar/>
      <Switch>
        <Route path="/url/create" exact component={LoginsCreate} />
        <Route path="/url/find/" exact component={LoginsFindByUrl} />
        <Route path="/urls/all" exact component={LoginsFindAll} />
        <Route path="/url/update/" exact component={LoginsUpdate} />
      </Switch>
    </Router>
  )
}

export default App
