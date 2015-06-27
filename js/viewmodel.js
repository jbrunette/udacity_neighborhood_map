function ViewModel() {
	var self = this;

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

  ///////////////////////////////////////////////
  // Locations
  ///////////////////////////////////////////////

	// Stores locations we're providing
	self.locations = ko.observableArray();

	// Method allowing locations to be added
	self.add_location = function(label, address) {
		var location_info = {"label":label, "address": address};
		var maps_loc;

    // Attempt to get geocoder data for address
    maps_geocoder.geocode({"address":address}, function(results, status) {

    	// Did we get a good response?
      if (status == google.maps.GeocoderStatus.OK) {
        maps_loc = results[0].geometry.location;

		    // Create marker
		    location_info.marker = new google.maps.Marker({"position":maps_loc, "map":map, "title":label});

			  // Register click of marker
			  google.maps.event.addListener(location_info.marker, "click", function() {
		      self.marker_click(location_info);
			  });

        // Add location to model's locations array
 			  self.locations.push(location_info);
      }

      else {
      	alert("Unable to find location information in Google Maps for address '" + address + "'");
      }
    });
	}

  ///////////////////////////////////////////////
  // Search
  ///////////////////////////////////////////////

  self.search_text = ko.observable();

  ///////////////////////////////////////////////
  // Locations To Show
  ///////////////////////////////////////////////

  // This returns an array of locations whose labels contain the text entered into the search box
  self.locations_to_show = ko.pureComputed(function() {
    return ko.utils.arrayFilter(this.locations(), function(location) {
    	if (!self.search_text()) return true;
      return location.label.toLowerCase().indexOf(self.search_text().toLowerCase()) > -1;
    });
  }, self);

  ///////////////////////////////////////////////
  // Markers
  ///////////////////////////////////////////////

  // Handle click of marker (or marker's entry in location list)
  self.marker_click = function(location_data) {

  	// Cause marker to bounce three times (about 700ms per bounce)
    location_data.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
    	location_data.marker.setAnimation(null);
    }, 2100);

    // Get wikipedia data for location
    $.ajax("http://en.wikipedia.org/w/api.php", {
      "cache":true,
      "data":{
          "format":"json",
          "action":"opensearch",
          "search":location_data.label
      },
      "dataType":"jsonp",
      "success":function(json) {
        var page_titles = json[1];
        var page_descs = json[2];
        var page_urls = json[3];

        // Show infowindow
		    infowindow_obj.setContent("<h1>" + location_data.label + "</h1><br>" + page_descs[0] + "<br><br><a href='" + page_urls[0] + "' target='_blank'>More information at Wikipedia</a>");
		    infowindow_obj.open(map, location_data.marker);
			}
		});
  };

  // Show marker
  this.show_marker = function(el, index, location_data) {
    location_data.marker.setVisible(true);
  };

  // Hide marker
  this.hide_marker = function(el, index, location_data) {
    location_data.marker.setVisible(false);
    $(el).remove();  // Element must be removed manually during beforeRemove
  };
}