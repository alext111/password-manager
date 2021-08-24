import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NavBar } from '../components'
import { LoginsCreate, LoginsFindByUrl, LoginsFindAll, LoginsUpdate } from '../pages'


import 'bootstrap/dist/css/bootstrap.min.css'

//homepage
function App() {
  return (
    <Router>
      <NavBar/>
      <Switch>
        <Route path="/login/create" exact component={LoginsCreate} />
        <Route path="/login/find/" exact component={LoginsFindByUrl} />
        <Route path="/logins/all" exact component={LoginsFindAll} />
        <Route path="/login/update/" exact component={LoginsUpdate} />
      </Switch>
    </Router>
  )
}

export default App
