var map;
var markers = [];

var placeMarkers = [];
// Normally we'd have these in a database instead.
var locations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];
  function initMap() {

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 40.7413549,
        lng: -73.9980244
      },
      zoom: 13,
      mapTypeControl: false
    });


    //infowindow = new google.maps.InfoWindow();
    //ko.applyBindings(new appViewModel());

//----Defines data and behavior of the UI


// Normally we'd have these in a database instead.
var locations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

var largeInfowindow = new google.maps.InfoWindow();
// The following group uses the location array to create an array of markers on initialize.
for (var i = 0; i < locations.length; i++) {
  // Get the position from the location array.
  var position = locations[i].location;
  var title = locations[i].title;
  // Create a marker per location, and put into markers array.
   var marker = new google.maps.Marker({
    position: position,
    title: title,
    animation: google.maps.Animation.DROP,
    id: i
  });
var infowindow = new google.maps.InfoWindow({
	content: 'info window'
});
  // Push the marker to our array of markers.
  markers.push(marker);
  // Create an onclick event to open an infowindow at each marker.
  marker.addListener('click', function() {
    populateInfoWindow(this, largeInfowindow);
  });
}
showListings();
ko.applyBindings(new appViewModel());

}
//###Defines data and Behavior of UI
var appViewModel = function () {
var self = this;
this.firstName = ko.observable("nolan");
self.filterPlaces= ko.observable("yeah lets go!");

this.filter = ko.observable("");
// Click functionality - when the cafe item is clicked on the sidebar, the
// infobox of that particular marker opens
this.locationClicked = function(location) {
  google.maps.event.trigger(location.marker, 'click');
};

	// Filter places based on user input.
	this.filteredLocations = ko.computed(function() {
		var filter = self.filter().toLowerCase();
		if (!filter) {
			locations.forEach(function(location) {
				if (location.marker) {
					location.marker.setVisible(true);
				}
			});
			return locations;
		} else {
			return ko.utils.arrayFilter(locations, function() {
		 		var match = location.title.toLowerCase().indexOf(filter) !== -1;
		 		if (match) {
		 			location.marker.setVisible(true);
		 		} else {
		 			location.marker.setVisible(false);
		 		}
		 		return match;
		 	});
		}
});


};
/**
* Open marker info window when corresponding item was clicked.
*/
function clickedMarker(title) {
  print("clickedMarker");

	markers.forEach(function(markerItem) {
		if (markerItem.name == title) {
			google.maps.event.trigger(markerItem.marker, 'click');
		}
	});
}

function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}
// This function will loop through the markers array and display them all.
function showListings() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

      // This function creates markers for each place found in either places search.
      function createMarkersForPlaces(places) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < places.length; i++) {
          var place = places[i];
          var icon = {
            url: place.icon,
            size: new google.maps.Size(35, 35),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 34),
            scaledSize: new google.maps.Size(25, 25)
          };
          // Create a marker for each place.
          var marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location,
            id: place.place_id
          });
          // Create a single infowindow to be used with the place details information
          // so that only one is open at once.
          var placeInfoWindow = new google.maps.InfoWindow();
          // If a marker is clicked, do a place details search on it in the next function.
          marker.addListener('click', function() {
            if (placeInfoWindow.marker == this) {
              console.log("This infowindow already is on this marker!");
            } else {
              getPlacesDetails(this, placeInfoWindow);
            }
          });
          placeMarkers.push(marker);
          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        }
        map.fitBounds(bounds);
      }

// This is the PLACE DETAILS search - it's the most detailed so it's only
// executed when a marker is selected, indicating the user wants more
// details about that place.
function getPlacesDetails(marker, infowindow) {
  var service = new google.maps.places.PlacesService(map);
  service.getDetails({
    placeId: marker.id
  }, function(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Set the marker property on this infowindow so it isn't created again.
      infowindow.marker = marker;
      var innerHTML = '<div>';
      if (place.name) {
        innerHTML += '<strong>' + place.name + '</strong>';
      }
      if (place.formatted_address) {
        innerHTML += '<br>' + place.formatted_address;
      }
      if (place.formatted_phone_number) {
        innerHTML += '<br>' + place.formatted_phone_number;
      }
      if (place.opening_hours) {
        innerHTML += '<br><br><strong>Hours:</strong><br>' +
            place.opening_hours.weekday_text[0] + '<br>' +
            place.opening_hours.weekday_text[1] + '<br>' +
            place.opening_hours.weekday_text[2] + '<br>' +
            place.opening_hours.weekday_text[3] + '<br>' +
            place.opening_hours.weekday_text[4] + '<br>' +
            place.opening_hours.weekday_text[5] + '<br>' +
            place.opening_hours.weekday_text[6];
      }
      if (place.photos) {
        innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
            {maxHeight: 100, maxWidth: 200}) + '">';
      }
      innerHTML += '</div>';
      infowindow.setContent(innerHTML);
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  });
}
//TODO crate location Model that holds parameters of this.name ,this.posistion this.marker listener
//this.set visible boolean

var locModel= function (data){
  var self = this;
  this.title = observable(data.title);
  this.position = data.position;
  this.marker = new google.mapsMarker({
    map: map,
    position: this.position,
    title: this.title()
  });
  this. marker.addListener('click', function () {
    moreInfo(self.marker);
    togglefunction(self.marker)
  })
}
moreinfo function (){
  console.log("more Info window pops up here!");
}
togglefunction (){
  console.log("toggle fuction was called! ")
}
/**
var Location = function (data) {
    this.title = ko.observable(data.title);
    this.position = data.position;
    this.marker = new google.maps.Marker({
        map: map,
        position: this.position,
        title: this.title()
    });

    var self = this;

    this.marker.addListener('click', function () {
        showInfo(self.marker);
        toggleBounce(self.marker);
    });
};

function toggleBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    // Timeout after one bounce
    setTimeout(function () {
        marker.setAnimation(null);
    }, 700);
}

var infowindow;

function showInfo(marker) {
    var contentString = '';
    // load wikipedia data
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='
        + marker.title + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function () {
        contentString = 'Failed to get wikipedia resources';
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
    }, 6000);

    infowindow.open(map, marker);

    $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function (response) {

            var articleList = response[2];
            if (!articleList) {
                contentString = 'Data is not available.';
            }
            else {
                for (var i = 0; i < articleList.length; i++) {
                    articleStr = articleList[i];
                    contentString += articleStr;
                }
            }

            clearTimeout(wikiRequestTimeout);
            infowindow.setContent(contentString);
        }
    });
}

var ViewModel = function () {
    var self = this;

    this.locationList = ko.observableArray([]);
    this.filter = ko.observable('');

    initialLocations.forEach(function (locationItem) {
        self.locationList.push(new Location(locationItem));
    });

    this.filteredLocations = ko.computed(function () {
        return ko.utils.arrayFilter(self.locationList(), function (location) {
            if (self.filter().length === 0 ||
                location.title().toLowerCase().includes(self.filter().toLowerCase())) {
                location.marker.setVisible(true);
                return true;
            } else {
                location.marker.setVisible(false);
                return false;
            }
        });
    });

    this.showLocation = function (clickedLocation) {
        showInfo(clickedLocation.marker);
        toggleBounce(clickedLocation.marker);
    };
};


 * Initialize Google Maps.
 **/
/*
function initMap() {
    var singapore = new google.maps.LatLng(1.379943, 103.806161);
    map = new google.maps.Map(document.getElementsByClassName('map')[0], {
        center: singapore,
        zoom: 10
    });
    infowindow = new google.maps.InfoWindow();
    ko.applyBindings(new ViewModel());
}

function googleError() {
    $('.map').text('Failed to load Google Maps.');
}
*/
