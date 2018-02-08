


  var map;

var markers = [];
  function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 40.7413549,
        lng: -73.9980244
      },
      zoom: 21
    });
    var tribeca = {lat:40.7413549, lng: -74.0089934};
    //infowindow = new google.maps.InfoWindow();
    //ko.applyBindings(new appViewModel());

//----Defines data and behavior of the UI



var locations = [
    {
        title: 'Ion Orchard',
        location: {lat: 1.313472, lng: 103.831670}
    },
    {
        title: 'Esplanade Singapore',
        location: {lat: 1.289836, lng: 103.856417}
    },
    {
        title: 'Sentosa',
        location: {lat: 1.250466, lng: 103.830388}
    },
    {
        title: 'Marina Bay Sands',
        location: {lat: 1.283213, lng: 103.860309}
    },
    {
        title: 'Singapore Zoo',
        location: {lat: 1.404346, lng: 103.793022}
    }
];

var largeInfowindow = new google.maps.InfoWindow();
// The following group uses the location array to create an array of markers on initialize.
//for (var i = 0; i < locations.length; i++) {
  // Get the position from the location array.
//  var position = locations[i].location;
 // var title = locations[i].title;
  // Create a marker per location, and put into markers array.
   var marker = new google.maps.Marker({
    position: tribeca,
    title: 'First Marker!',
    animation: google.maps.Animation.DROP,
    id: i
  });
var infowindow = new google.maps.InfoWindow({
	content: 'info window'
});
  // Push the marker to our array of markers.
  //markers.push(marker);
  // Create an onclick event to open an infowindow at each marker.
  //marker.addListener('click', function() {
 //   populateInfoWindow(this, largeInfowindow);
 /// });
//}
}
var appViewModel = function () {

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

/*
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

/**
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
