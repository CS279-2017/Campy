// modules/Home.js
import React from 'react'
import { Link } from 'react-router'
import {map, initMap} from '../js/map.js'

export default React.createClass({
  render() {
  	return(
  		<div>
		    <div id="map"></div>
		    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAUimB4-PZ_y2N96diVv7i95xPIsayoF3E&callback=initMap"></script>
	    </div>
  )
  }
})