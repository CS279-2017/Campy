import React from 'react'
import NavLink from '../modules/NavLink'

require("style-loader!css-loader!../css/welcomemodal.css");

let ReactBootstrap = require('react-bootstrap');
let Modal = ReactBootstrap.Modal
let OverlayTrigger = ReactBootstrap.OverlayTrigger
let Button = ReactBootstrap.Button

export default class firstLoginHelpModal extends React.Component {

  constructor(){
  	super();
  	this.state =(
  		{ 
        showModal: true, 
        thankyouText:"Thank you for joining campy!",
        infoText:"Here are a few things you should know...",
  		  addSiteText:"Click '+Add a Campsite' to add a new camp site to the map.",
        zoomText:"Zoom in on the area you want to camp or use the search bar to locate on the map.",
        searchBarNote:"Use the Search Bar to locate an area, then use the map to locate nearby sites.",
        clickNote:"Click the marker to find out more about the sidebar.",
        page:0,
      });

  }

  open(){
    this.setState({ showModal: true });
  }
  
  close(){
    this.setState({ showModal: false });
  }


  render() {
    if(this.props.firstLogin){
      if(this.state.page == 0){
      return(

       <Modal className="welcomemodal-modal" show={this.state.showModal}>
        <div className="welcomemodal-container">
          <img className="welcome-image" src={"/img/welcome.png"} alt="Welcome!"/>
          <h3 className="center-text d-blue">{this.state.thankyouText}</h3>
          <h4 className="center-text d-blue">{this.state.infoText}</h4>
          <p className="center-text l-blue">{this.state.loginText}</p>
          <input type="button" onClick={()=>{this.setState({page:1})}} name="back" className="login register-half-button" value="Next"/>
        </div>            
       </Modal>
       )
      }else if(this.state.page == 1){
                return(

       <Modal className="welcomemodal-modal" show={this.state.showModal}>
        <div className="welcomemodal-container">
          <h4 className="center-text d-blue">{this.state.addSiteText}</h4>
          <img className="thankyou-image" src={"/img/addcampsite.png"} alt="Welcome!"/>

          <input type="button" onClick={()=>{this.setState({page:0})}} name="back" className="login register-half-button" value="Back"/>
          <input type="button" onClick={()=>{this.setState({page:2})}} name="back" className="login register-half-button" value="Next"/>
        </div>            
       </Modal>
       )
      }else if(this.state.page == 2){
        return(
       <Modal className="welcomemodal-modal" show={this.state.showModal}>
        <div className="welcomemodal-container">
          <h4 className="center-text d-blue">{this.state.searchBarNote}</h4>
          <img className="thankyou-image" src={"/img/searchbar.png"} alt="Welcome!"/>
          <h4 className="center-text d-blue">{this.state.clickNote}</h4>
          <img className="thankyou-image" src={"/img/markerexample.png"} alt="Welcome!"/>
          <input type="button" onClick={()=>{this.setState({page:1})}} name="back" className="login register-half-button" value="Back"/>
          <input type="button" onClick={()=>{this.setState({page:0, showModal:false})}} name="back" className="login register-half-button" value="Close"/>
        </div>            
       </Modal>
       )
      }else{
        return null;
      }
    }else{
      return null;
    }
    
  }
}