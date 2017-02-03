import React from 'react'
import { render } from 'react-dom'
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import App from './modules/App'
import Nav from './modules/Nav'
import Home from './modules/Home'


render((<Router history={browserHistory}>
		<Route path="/" component={Nav}>
			<IndexRoute component={Home}/>
		</Route>
	   </Router>
	),document.getElementById('app'))
