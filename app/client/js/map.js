
export default {map, initMap};

var map;

function initMap() {
  console.log("initmap called")
  $("#map").height($( window ).height()*.80);

  var nash = {lat: 36.1627, lng: -86.7816};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: nash
  });
   
}

