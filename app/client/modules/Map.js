// modules/Home.js
import React from 'react'
import { Link } from 'react-router'
import ("../js/map.js")

export default React.createClass({
  render() {
  	return(
  		<div>
		    <div id="map"></div>
	    </div>
  )
  }
})