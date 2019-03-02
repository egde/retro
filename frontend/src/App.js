import React, { Component } from 'react';
import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './retro.css';

import { HashRouter, Switch, Route} from 'react-router-dom';

import BoardOverview from './pages/BoardOverview.jsx';
import Board from './pages/Board.jsx';

class App extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path='/' component={BoardOverview}/>
          <Route path='/board/:id' component={Board}/>
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
