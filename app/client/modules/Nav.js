import React from 'react'
import NavLink from './NavLink'
import TagDropdown from '../components/TagDropdown'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'
import ReactDOM from 'react-dom'
require("style-loader!css-loader!../css/nav.css");
require("style-loader!css-loader!../css/app.css");


export default React.createClass({
  getInitialState() {
    return{
      isLoggedIn: false,
      username:""
    }
  },
  componentWillMount(){
    this.checkLogin();
  },
  checkLogin(){
    var self = this;
    $.getJSON('/v1/ping').done(function (data) {
      console.log(data);
      if(data.loggedIn != self.state.isLoggedIn){
        self.setState({isLoggedIn : data.loggedIn});
      }
      if(data.username != self.username){
        self.setState({username : data.username});
      }
    });
    console.log(self);
  },

  callPath(path){
     //post to login
    let self = this;
    let success = function(){
      self.checkLogin();
    }
    $.ajax({
      type: "GET",
      url: path,
      success:success,
    });
  },

  update(){
    this.checkLogin();
  },

  render() {
    //if logged in
    if(this.state.isLoggedIn){
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
                <div className="nav navbar-nav searchbar-holder">
                    <div className="text-box logged-in-text-box">
                     <input type="text" className="searchBar" placeholder="Where would you like to camp?" />
                    </div>
                </div>
                <ul className="nav navbar-nav navbar-right">
                  <li><img className="profile-img img-rounded" src={'http://placehold.it/200x200&text=profilepic'}/></li>
                  <li><NavLink className="nav-links absolute" onClick={()=>{this.refs.campsiteModal.open()}}>+Add A Campsite</NavLink></li>
                  <li><NavLink className="nav-links profile-link absolute" onClick={()=>{this.callPath("/v1/logout"); this.checkLogin()}}>Logout</NavLink></li>
                </ul>
              </div>
            </div>
          </nav>
          <TagDropdown/>
          {this.props.children}
        </div>
        )
      //if not logged in
    }else{
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
                    <div className="text-box logged-out-text-box">
                     <input type="text" className="searchBar" placeholder="Where would you like to camp?" />
                    </div>
                </div>
                <ul className="nav navbar-nav navbar-right">
                  <li><NavLink className="nav-links" onClick={()=>{this.refs.loginModal.open()}}>Login</NavLink></li>
                  <li className><NavLink className="nav-links" onClick={()=>{this.refs.registerModal.open()}}>Register</NavLink></li>
                </ul>
              </div>
            </div>
          </nav>
          <TagDropdown/>
          <LoginModal ref='loginModal' self={this}/>
          <RegisterModal ref='registerModal' self={this}/>
          {this.props.children}
        </div>
      )
    }
  
    }
  
})




