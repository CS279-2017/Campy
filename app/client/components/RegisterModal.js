import React from 'react'
import NavLink from '../modules/NavLink'
import Dropzone from 'react-dropzone';

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
       error:"",
       profilePicture:"",
       uploadstatus:"",
       page:0,
       lntRules:['Plan ahead and prepare.',
        'Travel and camp on durable surfaces.',
        'Dispose of waste properly.',
        'Leave what you find.',
        'Minimize campfire impacts.',
        'Respect wildlife.',
        'Be considerate of other visitors.']
  		});
  	this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.state.user;

  }

  open(){
    this.setState({ showModal: true,
    page:0
     });
  }
  
  close(){
    this.setState({ 
      showModal: false,
     });
  }

  onDrop(acceptedFile) {
      this.setState({
        uploadstatus: "uploading..."
      });


      let formData = new FormData();
      //acceptedFile.forEach(function(file){

      let file = acceptedFile[0];
      let blob = new Blob([file], { type: file.type});
      //rename
      let name =  (new Date().toDateString()) + file.name;
      formData.append("images", blob, name);

      let request = new XMLHttpRequest();
      request.open("POST", "/v1/campsiteimage");
      let self = this;

      //callback
      request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          //add image
          self.setState({
            uploadstatus:"",
            profilePicture: name,
            error:"",
          });

        }else if (this.readyState == 4 && this.status == 500) {
          //produce error msg
          self.setState({
            uploadstatus:"",
            error: "An has error occurred.",
          });
        }
      };
      //send request
      request.send(formData);


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
      email:this.state.email,
      profilePicture:this.state.profilePicture,
    }
    let self = this;
    let success = function(xhr, ajaxOptions, thrownError){
      self.close();
      self.props.self.setState({firstLogin:true});
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

  removeImage(){

    this.setState({
      profilePicture:""
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
    if(this.state.page == 0){

      return (
  	     <Modal className="login-modal" show={this.state.showModal} onHide={()=>{this.close()}}>
  				<div className="loginmodal-container">
            <p className="closeButton" onClick={()=>{this.close()}}>x</p>
            <h1><img className="login-register-image" src={"/img/register.png"}/></h1><br/>

  					<input type="text" name="user" value={this.state.user} onChange={this.handleChange} placeholder="Username"/>
            <input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password"/>
            <input type="password" name="passwordCheck" value={this.state.passwordCheck} onChange={this.handleChange} placeholder="Password"/>
  					<input type="text" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email"/>
            <p className="center-text grey">{this.state.uploadstatus}</p>

            {this.state.profilePicture != "" ? 
                <div>
                  <p className="d-blue">Click to Remove</p>
                  <div><img onClick={()=>{this.removeImage()}} className="preview-image" src={"https://s3.amazonaws.com/campyapp1/images/" + this.state.profilePicture}/></div>
                </div>
                 :
                 <div className="register-image-drop">
                <form className="uploadImage" encType="multipart/form-data">
                <Dropzone className="my-image-drop" onDrop={this.onDrop} multiple={false} accept={"image/jpeg, image/png"}>
                  <div><h4 className="center-text d-blue">(Optional) Profile Picture</h4></div>
                </Dropzone>
                </form>
                </div>
              }
            <p className="error">{this.state.error}</p>
            <input type="button" name="login" onClick={()=>{this.setState({page:1})}} className="login loginmodal-submit" value="Next"/>
  				</div>	          
  	     </Modal>
  	  )
    }else{
        return (
         <Modal className="login-modal" show={this.state.showModal} onHide={()=>{this.close()}}>
          <div className="loginmodal-container lnt-container">
            <p className="closeButton" onClick={()=>{this.close()}}>x</p>
            <h1><img className="login-register-image" src={"/img/lntlogo.png"}/></h1><br/>
            <h3 className="d-blue">Campy Loves our Campsites</h3>
            <h4 className="l-blue">By registering, you are agreeing to be a good steward to the outdoors.</h4>
            
              {this.state.lntRules.map((item, i)=> (<p key={'lnt'+i} className="l-blue">{i+1}. {item}</p>) )}
            
            <p className="error">{this.state.error}</p>
              <input type="button" onClick={()=>{this.setState({page:0})}} name="back" className="login register-half-button" value="Back"/>
              <input type="button" onClick={this.handleSubmit} name="login" className="login register-half-button" value="Register"/>
          </div>            
         </Modal>
    )}
  }
}