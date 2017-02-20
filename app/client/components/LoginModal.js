import React from 'react'
import NavLink from '../modules/NavLink'
require("style-loader!css-loader!../css/loginmodal.css");

let ReactBootstrap = require('react-bootstrap');
let Modal = ReactBootstrap.Modal
let OverlayTrigger = ReactBootstrap.OverlayTrigger
let Button = ReactBootstrap.Button

export default class LoginModal extends React.Component {

  constructor(){
  	super();
  	this.state =(
  		{ showModal: false, 
  		 password: "",
  		 user: "" 
  		});
  	this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state.user 

  }

  open(){
    this.setState({ showModal: true });
  }
  
  close(){
    this.setState({ showModal: false });
  }

  handleSubmit(event) {
    event.preventDefault();

    const data = {
    	username:this.state.user,
    	password:this.state.password
    }
    let success = function(){
    	alert(this.close());
    }
    
	$.ajax({
	  type: "POST",
	  url: "/login",
	  data: data,
	  success: success
	});

  }

  handleChange(event) {
  	const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });

  }

  render() {

    return (
	        <Modal className="login-modal" show={this.state.showModal} onHide={this.close}>
				<div className="loginmodal-container">
					<h1>Login to Your Account</h1><br/>

				  <form onSubmit={this.handleSubmit}>
					<input type="text" name="user" value={this.state.user} onChange={this.handleChange} placeholder="Username"/>
					<input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password"/>
					<input type="submit" name="login" className="login loginmodal-submit" value="Login"/>
				  </form>
				
				  <div className="login-help">
					<a href="#">Register</a>  <a href="#">Forgot Password</a>
				  </div>
				</div>	          
	        </Modal>
	)
  }
}