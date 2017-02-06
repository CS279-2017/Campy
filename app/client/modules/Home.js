// modules/Home.js
import React from 'react'
import { Link } from 'react-router'
require("style-loader!css-loader!../css/cover.css");

export default React.createClass({

  render() {
  	return(
  		<div>
	  		<title>Campy - Welcome</title>
	  		<h1>Campy</h1>
	  		<p>Loading map...</p>
	    </div>
  )
  }
})