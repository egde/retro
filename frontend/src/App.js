import React, { Component } from 'react';
import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './retro.css';

import { HashRouter, Switch, Route} from 'react-router-dom';

import BoardOverview from './pages/BoardOverview.jsx';
import Board from './pages/Board.jsx';
import Landing from './pages/Landing';

class App extends Component {

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path='/' component={Landing}/>
          <Route exact path="/boards" component={BoardOverview}/>
          <Route path='/boards/:id' component={Board}/>
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
