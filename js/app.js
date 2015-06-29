$(function() {

  ///////////////////////////////////////////////
  // Preset Locations
  ///////////////////////////////////////////////
  var locations = [
    {"label":"Carroll University", "address": "100 North East Avenue, Waukesha, WI 53186, United States"},
    {"label":"Waukesha South High", "address": "401 East Roberta Avenue, Waukesha, WI 53186"},
    {"label":"Waukesha County Airport", "address": "2525 Aviation Drive, Waukesha, WI 53188, United States"},
    {"label":"Walmart", "address": "2000 South West Avenue, Waukesha, WI 53189, United States"}
  ];

  ///////////////////////////////////////////////
  // Google Maps API initialization
  ///////////////////////////////////////////////
  var mapOptions = {
    center: { lat: 42.9959294, lng: -88.2169016},
    zoom: 13
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // Create Geocoder object
  var maps_geocoder = new google.maps.Geocoder();

  // Create Google Maps InfoWindow object
  var infowindow_obj = new google.maps.InfoWindow();
  
  // Create and bind to ViewModel
  var viewmodel_obj = new ViewModel(map, maps_geocoder, infowindow_obj);
  ko.applyBindings(viewmodel_obj);

  // Add locations to model
  for (var i=0; i<locations.length; i++) {
    var loc_data = locations[i];
    viewmodel_obj.add_location(loc_data.label, loc_data.address);
  }

  // Resize elements, making the map canvas the height of the remaining space of the body, minus the search and location list heights
  $(window).resize(function() {
    var height = document.body.clientHeight - $(".row.search").get(0).offsetHeight - ($(".col-md-4").get(0).offsetTop != $("#map-canvas").get(0).offsetTop ? $(".col-md-4").get(0).offsetHeight : 0);
    $("#map-canvas").css("height", height + "px");
  });
  $(window).trigger("resize");

});
