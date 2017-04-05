import React from 'react'
import NavLink from '../modules/NavLink'
import StarRating from 'react-star-rating';
import Dropzone from 'react-dropzone';
import Tags from '../data/Tags.js'

require("style-loader!css-loader!../css/campsitemodal.css");

import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoBox,
} from "react-google-maps";

import SearchBox from "react-google-maps/lib/places/SearchBox";


let ReactBootstrap = require('react-bootstrap');
let Modal = ReactBootstrap.Modal
let OverlayTrigger = ReactBootstrap.OverlayTrigger
let Button = ReactBootstrap.Button

const INPUT_STYLE = {
  boxSizing: 'border-box',
  MozBoxSizing: 'border-box',
  border: '1px solid transparent',
  width: '150px',
  height: '32px',
  marginTop: '10px',
  padding: '0 15px',
  borderRadius: '1px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
  fontSize: '14px',
  outline: 'none',
  textOverflow: 'ellipses',
};

const SmallMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    zoom={props.zoom}
    center={props.center}
    onClick={props.onMapClick}
    onBoundsChanged={props.onBoundsChanged}
  >
  <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
      inputPlaceholder="Search location..."
      inputStyle={INPUT_STYLE}
  />
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
       center:{
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
       tags:[],
       rating:3,
       images:[],
       error:"",
       uploadstatus:"",
       chooseTags:Tags.tags(),
  		});
    this.key = 0;
  	this.handleChange = this.handleChange.bind(this);
    this.handleRating = this.handleRating.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.selectTag = this.selectTag.bind(this);
  
    //test
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleBoundsChanged = this.handleBoundsChanged.bind(this);
    this.handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
    this.handlePlacesChanged = this.handlePlacesChanged.bind(this);

  }
  //test
  handleMapLoad(map) {
    this._map = map;
  }

  handleBoundsChanged() {
    this.setState({
      bounds: this._map.getBounds(),
      center: this._map.getCenter(),
    });
  }

  handleSearchBoxMounted(searchBox) {
    this._searchBox = searchBox;
  }

  handlePlacesChanged() {
    const places = this._searchBox.getPlaces();

    console.log(places);

    // Set markers; set map center to first search result
    const mapCenter = places.length > 0 ? places[0].geometry.location : this.state.center;

    this.setState({
      center: mapCenter,
      zoom: 15,
    });
  }
  //endtest

  open(){
    this.setState({ showModal: true, step:1 });
  }
  
  close(){
    console.log("closing");
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
       tags:[],
       rating:3,
       error:"",
       images:[],
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
    console.log(marker);
  }


  //Handles step transition for the form.
  nextStep(num){
    console.log(this.state.chooseTags);
    //TODO: check for all info
    let error = "";
    let s = this.state;
    switch(this.state.step){
      case 1:
        if(s.campsiteName == "" || !s.marker[0]){
          error = "Please enter a name and place a marker on the map.";
        }
       
        break;
      case 2:
        if(!s.description){
          error = "Please add a description for the campsite."
        }else if(s.description.length < 50){
          error = "Description should be at least 50 characters."
        }
        break;
      case 3:
        if(!s.tags[0]){
          error = "Please select at least one tag."
        }
        break;
      case 4:
        break;
    }
    if(error != ""){
      this.setState({error:error});
    }else{
      this.setState({error:"",step:this.state.step + 1});
    }
  }

  previousStep(){
    this.setState({step:this.state.step - 1});
  }



  onDrop(acceptedFile) {
      console.log(acceptedFile);
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
            images: self.state.images.concat([name]),
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


  getkey(){
    this.key++;
    return this.key;
  }

  removeImage(file){
    arr = this.state.images;
    
    for (let i = 0; i < arr.length(); i++)
    {
      if (arr[i].equals(file))
      {
        array.splice(i, 1);
        break;
      }
    }
    this.setState({images:arr});
  }

  //toggles tag selection in campsite
  selectTag(name){
    let arr = this.state.tags;

    let i = arr.indexOf(name);
    if (i > -1) {
      arr.splice(i, 1);
    }else{
      arr.push(name);
    }
    
    this.setState({tags:arr});
    console.log(this.state.tags);
  }

  //handles submission of everything
  handleSubmit(event) {
    let s = this.state;
    if(s.campsiteName && s.marker[0] && s.description && s.tags[0]){
      //im assuming you'll do creator, date, and transform size (if you want) SS
      let marker = s.marker[0];
      //post data
      let data = {
        description: s.description,
        directions: s.specialdirections,
        fire: s.fires,
        name: s.campsiteName,
        rating: s.rating,
        size: s.tents,
        tags: s.tags,
        lat: marker.position.lat,
        long: marker.position.lng,
        images: s.images
      }
      
      let self = this;
      let success = function(){
        self.close();
      }
      let error = function(xhr, ajaxOptions, thrownError){
        self.setState({error:JSON.parse(xhr.responseText).error});
      }

      $.ajax({
        type: "POST",
        dataType: 'json',
        url: "/v1/addsite",
        data: data,
        success:success,
        error:error
      });
    
    }else{
      this.setState({
        error:"Please fill all required fields and give site at least one tag."
      });
    }
  }

///////////////////////////////////////////////////////
///////////////////RENDER METHODS//////////////////////
///////////////////////////////////////////////////////
  NameAndMap(){
    return (
       <Modal className="campsite-modal" show={this.state.showModal} onHide={()=>{this.close()}}>
        <div className="campsitemodal-container">
        <p className="closeButton" onClick={()=>{this.close()}}>x</p>
        <div>
            <div className="campsitemodal-color">
              <h1><img className="login-register-image" src={"/img/logo.png"}/></h1><br/>
              <h4>Step 1/4</h4>
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
                center = {this.state.center}
                zoom = {this.state.zoom}
                markers={this.state.marker}
                onCenterChanged={this.handleCenterChanged}


                onBoundsChanged={this.handleBoundsChanged}
                onSearchBoxMounted={this.handleSearchBoxMounted}
                bounds={this.state.bounds}
                onPlacesChanged={this.handlePlacesChanged}
              />
              </div>
              <p className="error">{this.state.error}</p>
              <input type="button" name="next" className="login campsitemodal-submit" onClick={()=>{this.nextStep()}} value="Next"/>
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
                  <h4>Step 2/4</h4>
                  <p>Special Directions and Description</p>             
                </div>
                <div className="add-form" >

                  <p className="bold">Price:</p>             
                  <div className="row price-buttons">
                    <label className="radio-inline">
                      <input type="radio" name="price" value="0" onChange={this.handleChange} checked={this.state.price == 0}/>FREE
                    </label>
                    <label className="radio-inline">
                      <input type="radio" name="price" value="1" onChange={this.handleChange} checked={this.state.price == 1}/>$
                    </label>
                    <label className="radio-inline">
                      <input type="radio" name="price" value="2" onChange={this.handleChange} checked={this.state.price == 2}/>$$
                    </label> 
                    <label className="radio-inline">
                      <input type="radio" name="price" value="3" onChange={this.handleChange} checked={this.state.price == 3}/>$$$
                    </label>
                  </div>
                  <p className="bold">Description:</p>
                  <textarea name="description" value={this.state.description} onChange={this.handleChange} placeholder="Required"></textarea>
                  <p className="description-chars">Characters: {this.state.description.length}</p>
                  <p className="bold">Special Directions:</p>
                  <textarea name="specialdirections" value={this.state.specialdirections} onChange={this.handleChange} placeholder="Optional"></textarea>
                  <p className="error">{this.state.error}</p>
                  <input type="button" name="back" className="login campsitemodal-submit" onClick={()=>{this.previousStep()}} value="Back"/>
                  <input type="button" name="next" className="login campsitemodal-submit" onClick={()=>{this.nextStep()}} value="Next"/>
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
                  <h4>Step 3/4</h4>
                  <p>Size and Tags</p>             
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
                  <div className="">
                  <p className="bold">Tags (Select Multiple):</p>
                    <div className="tag-box">
                    {this.state.chooseTags.map((tag)=>{
                      if(this.state.tags.indexOf(tag.name)>-1){
                        return <a className="btn btn-lg campsite-tag campsite-tag-active" key={tag.name} onClick={() => this.selectTag(tag.name)}>{tag.name}</a>
                      }else{
                        return <a className="btn btn-lg campsite-tag" key={tag.name} onClick={() => this.selectTag(tag.name)}>{tag.name}</a>
                      }
                    })}
                    </div>
                    <p className="error">{this.state.error}</p>
                  </div>
                  <input type="button" name="back" className="login campsitemodal-submit" onClick={()=>{this.previousStep()}} value="Back"/>
                  <input type="button" name="next" className="login campsitemodal-submit" onClick={()=>{this.nextStep()}} value="Next"/>
                
                </div>
                
              </div>

            </div>   
            </div>         
           </Modal>
      ) 
  }

  Images(){
    return (
               <Modal className="campsite-modal" show={this.state.showModal} onHide={()=>{this.close()}}>
                <div className="campsitemodal-color">             
                <div className="campsitemodal-container">
                <p className="closeButton" onClick={()=>{this.close()}}>x</p>
                <div>
                    <div className="campsitemodal-color">
                      <h4>Step 4/4</h4>
                      <p>Recommended - Add Photos</p>             
                    </div>
                    <div className="add-form">
                    <div className="image-drop-container">

                      <form className="uploadImage" encType="multipart/form-data">
                      <Dropzone className="image-drop" onDrop={this.onDrop}>
                        <div><p className="center-text">Drop Images here or Click to Open File Browser</p></div>
                      </Dropzone>
                      </form>
                      {this.state.images.length > 0 ? <div>
                      <p className="dark-gray">{this.state.uploadstatus}</p>
                      <div>{this.state.images.map((url) => <img key={this.getkey()} onClick={()=>{this.removeImage(file)}} className="preview-image" src={"https://s3.amazonaws.com/campyapp1/" + url} /> )}</div>

                      </div> : null}
                    </div>
                    <p className="error">{this.state.error}</p>
                    <input type="button" name="back" className="login campsitemodal-submit" onClick={()=>{this.previousStep()}} value="Back"/>
                    {this.state.uploadstatus == "" ? 
                      <input type="button" name="next" className="login campsitemodal-submit" onClick={()=>{this.handleSubmit()}} value="Submit"/>
                      : null
                    }
                    
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
          return this.Images()
        case 5:
          return(<div></div>);

      }
    }
    
  }
}