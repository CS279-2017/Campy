// modules/Home.js
import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  render() {
  	return(
  		<div>
  		<link href="https://getbootstrap.com/examples/cover/cover.css" rel="stylesheet"/>
	  	<div className="site-wrapper">
	      <div className="site-wrapper-inner">
	        <div className="cover-container">
	          <div className="inner cover">
	            <h1 className="cover-heading">Campy.</h1>
	            <p className="lead"> Welcome to Campy</p>
	            <p className="lead">
	              <Link to="/signup" className="btn btn-lg btn-default">Register</Link>
	            </p>
	            <p className="lead">
	              <Link to="/login" className="btn btn-lg btn-default">Login</Link>
	            </p>
	          </div>
	          <div className="mastfoot">
	            <div className="inner">
	              <p>Website created by <a href="http://www.turnerstrayhorn.com">Turner</a></p>
	            </div>
	          </div>
	        </div>
	      </div>
	    </div>
	    </div>
  )
  }
})