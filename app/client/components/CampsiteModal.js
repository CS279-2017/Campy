import React from 'react'
import NavLink from '../modules/NavLink'
import StarRating from 'react-star-rating';

require("style-loader!css-loader!../css/campsitemodal.css");

import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoBox,
} from "react-google-maps";


let ReactBootstrap = require('react-bootstrap');
let Modal = ReactBootstrap.Modal
let OverlayTrigger = ReactBootstrap.OverlayTrigger
let Button = ReactBootstrap.Button


const SmallMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    zoom={props.zoom}
    center={props.center}
    onClick={props.onMapClick}
  >
  {props.markers.map(marker => (
      <Marker
        {...marker}
        onClick={() => props.onMarkerClick(marker)}
      />
    ))}
  </GoogleMap>
));



export default class CampsiteModal extends React.Component {

  constructor(){
  	super();
  	this.state =(
  		{ 
       showModal: false, 
       error:"",
       step:1,
       defaultCenter:{
        lng:-98.5795, lat:39.8282
       },
       zoom:3,
       marker: [],
       campsiteName:"",
       description:"",
       specialdirections:"",
       fires:false,
       price:0,
       tents:1,
       tags:"",
       rating:3,

  		});
  	this.handleChange = this.handleChange.bind(this);
    this.handleRating = this.handleRating.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);

    this.state.user 

  }

  open(){
    this.setState({ showModal: true, step:1 });
  }
  
  close(){
    this.clearValues();
    this.setState({ showModal: false });
  }
  clearValues(){
    this.setState({
       marker: [],
       campsiteName:"",
       description:"",
       specialdirections:"",
       fires:false,
       price:0,
       tents:1,
       tags:"",
       rating:3,
    });
  }

  handleSubmit(event) {
    let s = this.state;
    if(s.campsiteName && s.marker[0] && s.description && s.tags){
      console.log("Good");
    }else{
      console.log("Bad");
    }
  }

  handleChange(event) {
  	const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  }

  handleRating(event, rate){
    console.log(rate);
    const value = rate.rating;
    this.setState({rating:value});
  }


  handleMapClick(click){
    let marker = {
          show:true,
          position: click.latLng,
          defaultAnimation: 2,
          icon: {
            scaledSize: new google.maps.Size(30, 30),
            url: 'img/marker.png' 
          },
          key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys,
    }
    marker = [marker];
    this.setState({marker:marker});
  }
  nextStep(num){
    //TODO: check for all info
    this.setState({step:this.state.step + 1});
  }

  previousStep(){
    this.setState({step:this.state.step - 1});
  }

  NameAndMap(){
    return (
       <Modal className="campsite-modal" show={this.state.showModal} onHide={()=>{this.close()}}>
        <div className="campsitemodal-container">
        <p className="closeButton" onClick={()=>{this.close()}}>x</p>
        <div>
            <div className="campsitemodal-color">
              <h1><img className="login-register-image" src={"/img/logo.png"}/></h1><br/>
              <h4>Step 1/3</h4>
              <p>Name and Location:</p>
            </div>
            <div className="add-form">
              <p className="bold">Campsite Name:</p>             

              <input type="text" name="campsiteName" value={this.state.campsiteName} onChange={this.handleChange} placeholder="Campsite Name"/>
              <div className="campsite-rater">
                <StarRating name="airbnb-rating" editing={true} rating={this.state.rating} onRatingClick={this.handleRating} ratingAmount={5} />
              </div>
              <p className="bold">Select Location:</p>             
              <div className="small-map-container">
              <SmallMap
                containerElement={
                  <div style={{ height: '100%' }} />
                }
                mapElement={
                  <div style={{ height: '100%' }} />
                }
                onMapLoad={this.handleMapLoad}
                onMapClick={this.handleMapClick}
                center = {this.state.defaultCenter}
                zoom = {this.state.zoom}
                markers={this.state.marker}
                onCenterChanged={this.handleCenterChanged}
              />
              </div>
              <input type="button" name="next" className="login campsitemodal-submit" onClick={()=>{this.nextStep(1)}} value="Next"/>
            </div>
            
          </div>
        </div>            
       </Modal>
  ) 
  }

  DirectionsAndDescription(){
    return (
           <Modal className="campsite-modal" show={this.state.showModal} onHide={()=>{this.close()}}>
            <div className="campsitemodal-color">             
            <div className="campsitemodal-container">
            <p className="closeButton" onClick={()=>{this.close()}}>x</p>
            <div>
                <div className="campsitemodal-color">
                  <h4>Step 2/3</h4>
                  <p>Special Directions and Description</p>             
                </div>
                <div className="add-form" >

                  <p className="bold">Price:</p>             
                  <div className="row price-buttons">
                    <label className="radio-inline">
                      <input type="radio" name="price" value="0"/>FREE
                    </label>
                    <label className="radio-inline">
                      <input type="radio" name="price" value="1"/>$
                    </label>
                    <label className="radio-inline">
                      <input type="radio" name="price" value="2"/>$$
                    </label> 
                    <label className="radio-inline">
                      <input type="radio" name="price" value="3"/>$$$
                    </label>
                  </div>
                  <p className="bold">Description:</p>
                  <textarea name="description" value={this.state.description} onChange={this.handleChange} placeholder="Required"></textarea>
                  <p className="bold">Special Directions:</p>
                  <textarea name="specialdirections" value={this.state.specialdirections} onChange={this.handleChange} placeholder="Optional"></textarea>

                  <input type="button" name="back" className="login campsitemodal-submit" onClick={()=>{this.previousStep()}} value="Back"/>
                  <input type="button" name="next" className="login campsitemodal-submit" onClick={()=>{this.nextStep(2)}} value="Next"/>
                </div>
                
              </div>

            </div>   
            </div>         
           </Modal>
      ) 
  }

  SizeAndTags(){
    return (
           <Modal className="campsite-modal" show={this.state.showModal} onHide={()=>{this.close()}}>
            <div className="campsitemodal-color">             
            <div className="campsitemodal-container">
            <p className="closeButton" onClick={()=>{this.close()}}>x</p>
            <div>
                <div className="campsitemodal-color">
                  <h4>Step 3/3</h4>
                  <p>Special Directions and Description</p>             
                </div>
                <div className="add-form">

                  <p className="bold">Number of Tents:</p>             
                  <div className="row tent-buttons">
                    <label className="radio-inline">
                      <input type="radio" name="tents" value="1" onChange={this.handleChange} checked={this.state.tents == 1}/>1
                    </label>
                    <label className="radio-inline">
                      <input type="radio" name="tents" value="2" onChange={this.handleChange} checked={this.state.tents == 2}/>2
                    </label>
                    <label className="radio-inline">
                      <input type="radio" name="tents" value="3" onChange={this.handleChange} checked={this.state.tents == 3}/>3
                    </label> 
                    <label className="radio-inline">
                      <input type="radio" name="tents" value="4" onChange={this.handleChange} checked={this.state.tents == 4}/>4 or More
                    </label>
                  </div>
                  <div className="left-align">
                  <label className="fires-box"><input type="checkbox" name="fires" onChange={this.handleChange} value="true" checked={this.state.fires}/> Campfires?</label>
                  </div>
                  <p className="bold">Tags (Separate by Commas):</p>
                  <textarea name="tags" value={this.state.tags} onChange={this.handleChange} placeholder="hammocks, pets, restroom, etc..."></textarea>
                  <input type="button" name="back" className="login campsitemodal-submit" onClick={()=>{this.previousStep()}} value="Back"/>
                  <input type="button" name="next" className="login campsitemodal-submit" onClick={()=>{this.handleSubmit()}} value="Submit"/>
                
                </div>
                
              </div>

            </div>   
            </div>         
           </Modal>
      ) 
  }

  render() {
    if(!this.state.showModal){
      return(<div></div>);
    }else{
      switch (this.state.step) {
        case 1:
          return this.NameAndMap()
        case 2:
          return this.DirectionsAndDescription()
        case 3:
          return this.SizeAndTags()
        case 4:
          return(<div></div>);

      }
    }
    
  }
}