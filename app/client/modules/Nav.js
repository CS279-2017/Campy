import React from 'react'
import NavLink from './NavLink'
import  {toggleDropdown, menuUp, menuDown, menu} from '../js/nav.js'
require("style-loader!css-loader!../css/nav.css");


export default React.createClass({

  render() {
    return (
      <div>
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
              <div className="nav navbar-nav searchBar-nav">
                <input type="text" className="searchBar" placeholder="Where would you like to camp?" />
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


//Dropdown Menu Component
class TagDropdown extends React.Component {
  constructor(){
    super();
    this.state={
      visible: false
    }
  }
  render() {
    if(!this.state.visible){
      return(
        <div className="nav-dropdown nav-dropdown-up">
          <img className="nav-dropdown-arrow" id="nav-dropdown-arrow" onClick={() =>this.setState({visible: true})} src="/img/dropdownarrow.png"></img>
        </div>
      )
    }else{
      return(
        <div className="nav-dropdown nav-dropdown-down">
          <div className="row">
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">$</a>
            <a className="btn btn-lg filter-tag">$$</a>
            <a className="btn btn-lg filter-tag">$$$</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">Tag</a>
          </div>
          <div className="row">
            <a className="btn btn-lg filter-tag">TagDaddy</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">TagDaddy</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">TagDaddy</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">TagDaddy</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">TagDaddy</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">TagDaddy</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">TagDaddy</a>
            <a className="btn btn-lg filter-tag">Tag</a>
            <a className="btn btn-lg filter-tag">TagDaddy</a>
            <a className="btn btn-lg filter-tag">Tag</a>

          </div>
          <img className="nav-dropdown-arrow" id="nav-dropdown-arrow" onClick={() =>this.setState({visible: false})} src="/img/dropdowndismiss.png"></img>
        </div>
      )
    }
  }
}

