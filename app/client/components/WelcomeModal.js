import React from 'react'
import NavLink from '../modules/NavLink'

require("style-loader!css-loader!../css/welcomemodal.css");

let ReactBootstrap = require('react-bootstrap');
let Modal = ReactBootstrap.Modal
let OverlayTrigger = ReactBootstrap.OverlayTrigger
let Button = ReactBootstrap.Button

export default class welcomeModal extends React.Component {

  constructor(){
  	super();
  	this.state =(
  		{ 
        showModal: true, 
        welcomeText:"Welcome to Campy!",
        infoText:"Campy is a web app that allows users to find and review campsites around the world with an easy to use interface.",
  		  loginText:"Please login or make an account to use campy!",
      });

  }

  open(){
    this.setState({ showModal: true });
  }
  
  close(){
    this.setState({ showModal: false });
  }


  render() {

    if(!this.props.isLoggedIn){
      return (
       <Modal className="welcomemodal-modal" show={this.state.showModal} onHide={()=>{this.close()}}>
        <div className="welcomemodal-container">
          <p className="closeButton" onClick={()=>{this.close()}}>x</p>
          <img className="welcome-image" src={"/img/welcome.png"} alt="Welcome!"/>
          <h3 className="center-text d-blue">{this.state.welcomeText}</h3>
          <h4 className="center-text d-blue">{this.state.infoText}</h4>
          <p className="center-text l-blue">{this.state.loginText}</p>
        </div>            
       </Modal>
  )
    }else{
      return null;
    }
    
  }
}