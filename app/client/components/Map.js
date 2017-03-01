/* global google */
import _ from "lodash";
import TagDropdown from './TagDropdown'

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

/*
 * This is the modify version of:
 * https://developers.google.com/maps/documentation/javascript/examples/event-arguments
 *
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={10}
    defaultCenter={{lat: 36.186314,lng: -87.0654323 }}
    onClick={props.onMapClick}
  >
    {props.markers.map(marker => (
      <Marker
        {...marker}
        onRightClick={() => props.onMarkerRightClick(marker)}
      />
    ))}
  </GoogleMap>
));

export default class GettingStartedExample extends Component {

  state = {
    markers: [],
  };

  handleMapLoad = this.handleMapLoad.bind(this);
  handleMapClick = this.handleMapClick.bind(this);
  handleMarkerRightClick = this.handleMarkerRightClick.bind(this);

  handleMapLoad(map) {
    this._mapComponent = map;
  }

  /*
   * This is called when you click on the map.
   * Go and try click now.
   */
  handleMapClick(event) {
    console.log("Map clicked at " + event.latLng);
    // const nextMarkers = [
    //   ...this.state.markers,
    //   {
    //     position: event.latLng,
    //     defaultAnimation: 2,
    //     key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
    //   },
    // ];
    // this.setState({
    //   markers: nextMarkers,
    // });

    // if (nextMarkers.length === 3) {
    //   this.props.toast(
    //     `Right click on the marker to remove it`,
    //     `Also check the code!`
    //   );
    // }
  }

  /*
  * Make api calls here
  */
  componentDidMount() {
    this.campsites = this.campsiteList();
  }
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
    console.log(sites);
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
          key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
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
  handleMarkerRightClick(targetMarker) {
    /*
     * All you modify is data, and the view is driven by data.
     * This is so called data-driven-development. (And yes, it's now in
     * web front end and even with google maps API.)
     */
     
    const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
    this.setState({
      markers: nextMarkers,
    });
  }

  //removes any markers without tags given
  //tags is array of strings
  removeMarkersWithoutTags(tags){
    console.log(tags);
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
    console.log(this.state.markers);
  }

  render() {
    return (
      <div className="map-container">
        <TagDropdown self={this}/>
        <div style={{height: '90%'}}>

          <GettingStartedGoogleMap
            containerElement={
              <div style={{ height: `100%` }} />
            }
            mapElement={
              <div style={{ height: `100%` }} />
            }
            onMapLoad={this.handleMapLoad}
            onMapClick={this.handleMapClick}
            markers={this.state.markers.filter(function(m){return m.show;})}
            onMarkerRightClick={this.handleMarkerRightClick}
          />
        </div>
      </div>
    );
  }
}