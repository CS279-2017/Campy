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
  		 user: "" ,
       error:""
  		});
  	this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loginerror = this.loginerror.bind(this);

    this.state.user 

  }

  open(){
    this.setState({ showModal: true });
  }
  
  close(){
    this.setState({ showModal: false });
  }

  login(){
    this.close();
    alert("Logged In");
  }

  loginerror(textStatus){
    alert(textStatus);
    this.state.error = textStatus;
  }

  handleSubmit(event) {
    event.preventDefault();

    const data = {
    	username:this.state.user,
    	password:this.state.password
    }
    let self = this;
    let success = function(){
      self.close();
      console.log(self.props.self);
      self.props.self.update();
    }

    //post to login
  	$.ajax({
  	  type: "POST",
  	  url: "/v1/login",
  	  data: data,
      success:success,
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
	     <Modal className="login-modal" show={this.state.showModal} onHide={()=>{this.close()}}>
				<div className="loginmodal-container">
          <p className="closeButton" onClick={()=>{this.close()}}>x</p>
					<h1><img className="login-register-image" src={"/img/login.png"}/></h1><br/>

				  <form onSubmit={this.handleSubmit}>
					<input type="text" name="user" value={this.state.user} onChange={this.handleChange} placeholder="Username"/>
					<input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password"/>
					<input type="submit" name="login" className="login loginmodal-submit" value="Login"/>
				  </form>
				  <div className="error">
             <p className = "login-error">{this.state.error}</p>
          </div>
				  <div className="login-help">
					   <a href="#">Forgot Password</a>
				  </div>
				</div>	          
	     </Modal>
	)
  }
}