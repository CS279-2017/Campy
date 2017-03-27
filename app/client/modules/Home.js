// modules/Home.js
import React from 'react'
import Helmet from "react-helmet"
import { Link } from 'react-router'
import GoogleMap from '../components/Map'

require("style-loader!css-loader!../css/cover.css");
require("style-loader!css-loader!../css/map.css");

export default React.createClass({

  render() {
  	return(
  		<GoogleMap/>
  	)
  }
})