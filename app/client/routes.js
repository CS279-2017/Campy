import React from 'react'
import { render } from 'react-dom'
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import App from './modules/App'
import Nav from './modules/Nav'
import Home from './modules/Home'
import Signup from './modules/Signup'
import Example from './modules/Example'


render((<Router history={browserHistory}>
		<Route path="/" component={Nav}>
			<IndexRoute component={Home}/>
		</Route>
	   </Router>
	),document.getElementById('app'))
