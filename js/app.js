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

  // Create and bind to ViewModel
  var viewmodel_obj = new ViewModel();
  ko.applyBindings(viewmodel_obj);

  // Add locations to model
  for (var i=0; i<locations.length; i++) {
    var loc_data = locations[i];
    viewmodel_obj.add_location(loc_data.label, loc_data.address);
  }
});
