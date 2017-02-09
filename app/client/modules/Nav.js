import React from 'react'
import NavLink from './NavLink'
import TagDropdown from '../components/TagDropdown'

require("style-loader!css-loader!../css/nav.css");
require("style-loader!css-loader!../css/app.css");


export default React.createClass({

  render() {
    return (
      <div className="app">
        <nav className="navbar navbar-default navbar-static-top">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
              </button>
              <a className="navbar-brand" to="/">
                <img className="navbar-brand-img" src="/img/logo.png"/>
              </a>
            </div>
            <div id="navbar">
              <div className="nav navbar-nav">
                  <div className="text-box">
                   <input type="text" className="searchBar" placeholder="Where would you like to camp?" />
                  </div>
              </div>
              <ul className="nav navbar-nav navbar-right">
                <li><NavLink className="nav-links" to="/login">Login</NavLink></li>
                <li><NavLink className="nav-links" to="/register">Register</NavLink></li>
              </ul>
            </div>
          </div>
        </nav>
        <TagDropdown/>
        {this.props.children}
      </div>
    )
  
    }
  
})




