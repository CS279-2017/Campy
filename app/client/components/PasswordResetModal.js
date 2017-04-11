import React from 'react'
import NavLink from '../modules/NavLink'
require("style-loader!css-loader!../css/loginmodal.css");

let ReactBootstrap = require('react-bootstrap');
let Modal = ReactBootstrap.Modal
let OverlayTrigger = ReactBootstrap.OverlayTrigger
let Button = ReactBootstrap.Button

export default class PasswordResetModal extends React.Component {

  constructor(){
  	super();
  	this.state =(
  		{ showModal: false, 
  		 password: "",
       passwordCheck: "",
  		 user: "" ,
       error:""
  		});
  	this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loginerror = this.loginerror.bind(this);

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
    if(this.state.user == "" || this.state.password == "" ){
     this.setState({error:"Please enter username and password."});
     return;
    }

    if(this.state.password != this.state.passwordCheck){
      this.setState({error:"Passwords must match."});
      return;
    }

    const data = {
      resettoken: this.props.token,
    	username:this.state.user,
    	newpassword:this.state.password
    }
    let self = this;
    let success = function(){
      self.close();
      self.props.self.update();
    }
    let error = function(xhr, ajaxOptions, thrownError){
      console.log(xhr.responseText);
      if(xhr.responseText == "Unauthorized"){
        self.setState({error:"Username or Password is not valid. Capitalization matters!"});
      }else{

        self.setState({error:JSON.parse(xhr.responseText).error});
      }
    }
    //post to login
  	$.ajax({
  	  type: "POST",
  	  url: "/v1/resetpassword",
  	  data: data,
      success:success,
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
  componentDidMount(){
    if(this.props.show){
      console.log("here");
      this.setState({showModal:true});
    }
  }

  render() {
    if(!this.props.show || this.props.token == null){
      return null;
    }

    return (
	     <Modal className="login-modal" show={this.state.showModal}>
				<div className="loginmodal-container">
          <h1><img className="resetpassword-image" src={"/img/resetpassword.png"}/></h1><br/>
				  <form onSubmit={this.handleSubmit}>
					<input type="text" name="user" value={this.state.user} onChange={this.handleChange} placeholder="Username"/>
          <input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password"/>
          <input type="password" name="passwordCheck" value={this.state.passwordCheck} onChange={this.handleChange} placeholder="Re-enter Password"/>
					<p className = "error">{this.state.error}</p>
          <input type="submit" name="login" className="login loginmodal-submit" value="Reset"/>
				  </form>
				</div>	          
	     </Modal>
	)
  }
}