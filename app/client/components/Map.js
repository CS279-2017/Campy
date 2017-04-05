/* global google */
import _ from "lodash";
import TagDropdown from './TagDropdown'
import SideBar from './SideBar'
import canUseDOM from "can-use-dom";

import {
  default as React,
  Component,
} from "react";

import {
  triggerEvent,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoBox,
} from "react-google-maps";




const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    zoom={props.zoom}
    center={props.center}
    onClick={props.onMapClick}
    onIdle={props.onCenterChanged}
    onZoomChanged={props.onZoomChanged}
  >

    {props.markers.map(marker => (
      <Marker
        {...marker}
        onClick={() => props.onMarkerClick(marker)}
      />
    ))}
  </GoogleMap>
));


export default class GettingStartedExample extends Component {

  state = {
    markers: [],
    zoom:5,
    defaultCenter:{
      lng:-98.5795, lat:39.8282
    },
    selected:null,
  };

  searchQuery = ""
  handleMapLoad = this.handleMapLoad.bind(this);
  handleMapClick = this.handleMapClick.bind(this);
  handleCenterChanged = this.handleCenterChanged.bind(this);
  handleZoomChange = this.handleZoomChange.bind(this);
  campsiteList = this.campsiteList.bind(this);

  // handleMarkerRightClick = this.handleMarkerRightClick.bind(this);

  handleMapLoad(map) {
    this._mapComponent = map;
  }

  /*
   * This is called when you click on the map.
   * Go and try click now.
   */
  handleMapClick(event) {
    this.setState({selectedSite:null});
  }
  handleZoomChange(event){
    let zoom = this._mapComponent.getZoom();
    this.setState({zoom:zoom});
  }
  handleCenterChanged(event){
    let ne = this._mapComponent.getBounds().getNorthEast();
    let sw = this._mapComponent.getBounds().getSouthWest();
    let thewindow = {latLng1:{lat:ne.lat(), lng:ne.lng()}, latLng2:{lat:sw.lat(), lng:sw.lng()}};
    this.campsiteList(thewindow);
  }
  /*
  * Make api calls here
  */
  componentDidMount() {
    /*
    * Get geolocation
    */
    let self = this;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        self.setState({
          defaultCenter:{
            lng:position.coords.longitude,
            lat:position.coords.latitude
          },
          zoom:10
        });
      },
      (error) => console.log("Location Could Not be Retrieved."),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

  }



  /*
  *
  *Call campsites api
  */
  campsiteList(thewindow) {
    if(this.state.zoom > 7){
      
      let self = this;
      let success = function(data){
        self.placeMarkers(data);
      }
      let error = function(err){
        console.log(err);
      }

      $.ajax({
          type: "GET",
          dataType: 'json',
          url: "/v1/campsites/window",
          data: thewindow,
          success:success,
          error:error
      });
    }else{
      console.log("zoom in");
    }

  }

  //removes all markers that are in state from the passed array returns updated
  removeMarkers(sites){
    let a = sites;
    let b = this.state.markers;
    for (let i = 0; i < b.length; i++){
      let id = b[i].metadata._id;
      for(let k = 0; k < a.length; k++){
        if(a[k]._id == id){
          a.splice(k, 1);
          k--;
        }
      }
    }
    return a;
  }

  //clears all markers in state no longer in the frame
  clearMarkers(sites){
    let a = sites;
    let b = this.state.markers;
    //for i in state
    for (let i = 0; i < b.length; i++){
      
      let id = b[i].metadata._id;
      let exists = false;

      for(let k = 0; k < a.length; k++){
        if(a[k]._id == id){
          exists = true;
        }
      }

      if(!exists){
        b.splice(i, 1);
        i--;
      }
    }

    this.setState({
      markers:b
    });
  }


  /*
  * Place campsite markers
  *
  */
  placeMarkers(sites){
    if(!sites){
      return;
    }
    this.clearMarkers(sites);
    if(!sites){
      return;
    }
    sites = this.removeMarkers(sites);
    if(!sites){
      return;
    }

    let map = this;
    sites.forEach(function(site){
      const campMarkers = [
        ...map.state.markers,
        {
          tags:site.tags,
          show:true,
          position: new google.maps.LatLng(site.lat, site.long),
          defaultAnimation: 2,
          icon: {
            scaledSize: new google.maps.Size(30, 30),
            url: 'img/marker.png' 
          },
          key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys,
          metadata:site,
        },
      ];
      map.setState({
        markers: campMarkers,
      });
    });

  }
 
  panToSearchLocation(query){
    //TODO: resolve query with google
    let self = this;
    let success = function(data){
      let place = data.results[0];
      if(place){
        
        //calculating the zoom value
        let GLOBE_WIDTH = 256; // a constant in Google's map projection
        let west = place.geometry.viewport.southwest.lng;
        let east = place.geometry.viewport.northeast.lng;
        let angle = east - west;
        if (angle < 0) {
          angle += 360;
        }
        let zoom = Math.round(Math.log(800 * 360 / angle / GLOBE_WIDTH) / Math.LN2);

        //pan to location
        let location = place.geometry.location;
        self._mapComponent.panTo(location);
        //update zoom
        self.setState({zoom:zoom});
      }else{
        console.log("No Place Found");
      }
    }
    let error = function(err){
      console.log("error");
      console.log(err);
    }
    let data = {query:query};
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: "/v1/place",
        data:data,
        success:success,
        error:error
    });

  }


  removeMarkersWithoutTags(tags){
    if(tags.length > 0){
      for(let i = 0; i < this.state.markers.length; i++){
        let sitetags = this.state.markers[i].tags;
        let match = 0;

        for(let k = 0; k < tags.length; k++){
          for(let j = 0; j < sitetags.length; j++)
          if(tags[k].toLowerCase() == sitetags[j].toLowerCase()){
            match++;
          }
        }
        if(match != tags.length){
          this.state.markers[i].show = false;
        }else{
          this.state.markers[i].show = true;
        }
      }
    }else{
      for(let i = 0; i < this.state.markers.length; i++){
        this.state.markers[i].show = true;
      }
    }
    
    this.forceUpdate();
  }



  render() {
    let self = this;
    window.onkeydown = function(e) {if(e.key == "Enter"){
      self.searchQuery = "";
    }};

    if(this.props.searchQuery){
      if(this.searchQuery != this.props.searchQuery){
        this.searchQuery = this.props.searchQuery;
        this.panToSearchLocation(this.props.searchQuery);
      }
    }
    return (
      <div className="map-container">
        <TagDropdown self={this}/>
        <SideBar selectedSite={this.state.selectedSite}/>
        <div style={{height: '100%'}}>

          <GettingStartedGoogleMap
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
            markers={this.state.markers.filter(function(m){return m.show;})}
            onMarkerClick={(marker)=>{this.setState({selectedSite:marker.metadata})}}
            onCenterChanged={this.handleCenterChanged}
            onZoomChanged={this.handleZoomChange}

          />
        </div>
      </div>
    );
  }
}