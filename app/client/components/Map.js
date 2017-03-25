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

  handleMapLoad = this.handleMapLoad.bind(this);
  handleMapClick = this.handleMapClick.bind(this);
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

  /*
  * Make api calls here
  */
  componentDidMount() {
    this.campsites = this.campsiteList();

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

  // recenterMap(){

  // }

  /*
  *
  *Call campsites api
  */
  campsiteList() {
    let map = this;
    return $.getJSON('/v1/campsites', function(data){
      map.placeMarkers(data);
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
  /*
  * Example method
  *
  */
  // handleMarkerRightClick(targetMarker) {
  //   /*
  //    * All you modify is data, and the view is driven by data.
  //    * This is so called data-driven-development. (And yes, it's now in
  //    * web front end and even with google maps API.)
  //    */
     
  //   const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
  //   this.setState({
  //     markers: nextMarkers,
  //   });
  // }

  // //removes any markers without tags given
  // //tags is array of strings
  // removeMarkersWithoutTags(tags){
  //   console.log(tags);
  //   if(tags.length > 0){
  //     for(let i = 0; i < this.state.markers.length; i++){
  //       let sitetags = this.state.markers[i].tags;
  //       let match = 0;

  //       for(let k = 0; k < tags.length; k++){
  //         for(let j = 0; j < sitetags.length; j++)
  //         if(tags[k].toLowerCase() == sitetags[j].toLowerCase()){
  //           match++;
  //         }
  //       }
  //       if(match != tags.length){
  //         this.state.markers[i].show = false;
  //       }else{
  //         this.state.markers[i].show = true;
  //       }
  //     }
  //   }else{
  //     for(let i = 0; i < this.state.markers.length; i++){
  //       this.state.markers[i].show = true;
  //     }
  //   }
    
  //   this.forceUpdate();
  //   console.log(this.state.markers);
  // }

  render() {
    return (
      <div className="map-container">
        <TagDropdown self={this}/>
        <SideBar selectedSite={this.state.selectedSite}/>
        <div style={{height: '100%'}}>

          <GettingStartedGoogleMap
            containerElement={
              <div style={{ height: `100%` }} />
            }
            mapElement={
              <div style={{ height: `100%` }} />
            }
            onMapLoad={this.handleMapLoad}
            onMapClick={this.handleMapClick}
            center = {this.state.defaultCenter}
            zoom = {this.state.zoom}
            markers={this.state.markers.filter(function(m){return m.show;})}
            onMarkerClick={(marker)=>{this.setState({selectedSite:marker.metadata})}}
            onCenterChanged={this.handleCenterChanged}
          />
        </div>
      </div>
    );
  }
}