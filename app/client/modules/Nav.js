import React from 'react'
import NavLink from './NavLink'

export default React.createClass({
  render() {
    return (
      <div>
        <link rel="stylesheet" href="/css/nav.css"/>
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
            <div id="navbar" className="navbar-collapse collapse">
              <div className="nav navbar-nav">
                <input type="text" class="  search-query form-control" placeholder="Where would you like to camp..." />
              </div>
              <ul className="nav navbar-nav navbar-right">
                <li><NavLink to="/example">Example2</NavLink></li>
                <li><NavLink to="/example">Example3</NavLink></li>
                <li><NavLink to="/example">Example4</NavLink></li>
              </ul>
            </div>
          </div>
        </nav>
        {this.props.children}
      </div>
    )
  }
})

