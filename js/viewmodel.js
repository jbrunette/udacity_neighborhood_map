function ViewModel(map, maps_geocoder, infowindow_obj) {
	var self = this;

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

    // Center on marker
    map.setCenter(location_data.marker.getPosition());

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
		    infowindow_obj.setContent("<div class='marker_infowindow'><h5>" + location_data.label + "</h5><br>" + page_descs[0] + "<br><br><a href='" + page_urls[0] + "' target='_blank'>More information at Wikipedia</a></h1></div>");
		    infowindow_obj.open(map, location_data.marker);
			},
      "error": function() {
        alert("An error occured attempting to retrieve Wikipedia data for the map marker.  Perhaps your Internet connection has been disconnected?");
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