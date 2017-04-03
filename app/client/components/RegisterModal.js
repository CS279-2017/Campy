import React from 'react'
import NavLink from '../modules/NavLink'
require("style-loader!css-loader!../css/loginmodal.css");

let ReactBootstrap = require('react-bootstrap');
let Modal = ReactBootstrap.Modal
let OverlayTrigger = ReactBootstrap.OverlayTrigger
let Button = ReactBootstrap.Button

export default class registerModal extends React.Component {

  constructor(){
  	super();
  	this.state =(
  		{ showModal: false, 
  		 password: "",
       passwordCheck:"",
  		 user: "",
       email:"",
       error:""
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

    if(this.state.password != this.state.passwordCheck){
      this.setState({error:"Passwords must match."})
      return;
    }

    const data = {
    	username:this.state.user,
    	password:this.state.password,
      email:this.state.email
    }
    let self = this;
    let success = function(){
      self.close();
      self.props.self.update();
    }
    let error = function(xhr, ajaxOptions, thrownError){
      console.log(xhr);
      self.setState({error:JSON.parse(xhr.responseText).error});
    }

    
	$.ajax({
	  type: "POST",
	  url: "/v1/register",
	  data: data,
	  success: success,
    error:error
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
          <h1><img className="login-register-image" src={"/img/register.png"}/></h1><br/>

				  <form onSubmit={this.handleSubmit}>
					<input type="text" name="user" value={this.state.user} onChange={this.handleChange} placeholder="Username"/>
          <input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password"/>
          <input type="password" name="passwordCheck" value={this.state.passwordCheck} onChange={this.handleChange} placeholder="Password"/>
					<input type="text" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email"/>
          <p className="error">{this.state.error}</p>
          <input type="submit" name="login" className="login loginmodal-submit" value="Register"/>
				  </form>
				</div>	          
	     </Modal>
	)
  }
}