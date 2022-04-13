//initialize the map object and the global array of markers as well as our mapbox token
var map;
var markers = [];
mapboxgl.accessToken = 'pk.eyJ1IjoiYnVzdGFtYWQiLCJhIjoiY2wxampwMHE4MjQ0dzNqcGNnd3M2czZrNyJ9.o5FchGZyzLsCxi4DO-gA8w';


//This whole portion is used to set the icon, got all this code from the mapbox api documentation down to line 44
const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        message: "Foo",
        iconSize: [60, 60],
      },
      geometry: {
        type: "Point",
        coordinates: [-66.324462, -16.024695],
      },
    },
    {
      type: "Feature",
      properties: {
        message: "Bar",
        iconSize: [50, 50],
      },
      geometry: {
        type: "Point",
        coordinates: [-61.21582, -15.971891],
      },
    },
    {
      type: "Feature",
      properties: {
        message: "Baz",
        iconSize: [40, 40],
      },
      geometry: {
        type: "Point",
        coordinates: [-63.292236, -18.281518],
      },
    },
  ],
};



//The init function sets the map to the correct state and fires the addMarkers function that will keep calling itself forever
function init(){
  var myOptions = {
  zoom :11,
  center : [-97.7115097, 30.096999],
  style: 'mapbox://styles/mapbox/streets-v11',
  container : "map"
  }

  map = new mapboxgl.Map(myOptions);
  addMarkers();
}

//addMarkers is our main function, in here we first populate the marker array in the first iteration, and update it every iterationa after
async function addMarkers(){
  var locations = await getBusLocations();
  locations.forEach(function(bus){
    var marker = getMarker(bus.signal_id)
    if(marker){moveMarker(marker,bus);}
    else{addMarker(bus);}
  });
  setTimeout(addMarkers,15000);
}


//getBusLocations is essentially our update fnuction. It pulls data from the austin API every 15 seconds and sends it back to addMarkers
async function getBusLocations(){
  var url = 'https://data.austintexas.gov/resource/5zpr-dehc.json'
  var resp = await fetch(url);
  var json = await resp.json();
  return json;//this returns an array for every bus info 
}

//addMarker Initializes the marker object for a specific marker with bus.signal_id
function addMarker(bus){
  let x = bus.location.coordinates[0];
  let y = bus.location.coordinates[1];
  const el = document.createElement('div');
  for(const marker of geojson.features)
  {
    const width = marker.properties.iconSize[0];
    const height = marker.properties.iconSize[1];
    el.className = 'marker';
    el.style.backgroundImage = `url(./bus.png)`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = '100%';
  }
  var mark = new mapboxgl.Marker(el).setLngLat([x,y]).addTo(map);
  //Here I used an object that stored the id and the marker together
  markers.push({id:bus.signal_id,marker:mark});
}

//moveMarker updates the marker using the bus object to update the markers array
function moveMarker(marker,bus){
  //var icon = getIcon(bus);
  //marker[1].setIcon(icon);
  let x = bus.location.coordinates[0];
  let y = bus.location.coordinates[1];
  /*
  let c = 0;
  if(marker.marker._lngLat.lng == x && marker.marker._lngLat.lat == y){
    c += 1;
  }
  else{
    console.log("Updated!")
  }
  Proved that we were updating correctly
  */
  
  marker.marker.setLngLat([x,y]);
}
//getMarker iterates through the markers array to find the object with the marker we need to update
function getMarker(id){
  for(let i =0;i < markers.length;i++){
    if(markers[i].id == id){
      return markers[i]
    }
  }
}

window.onload = init;
