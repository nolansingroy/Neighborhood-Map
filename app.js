var map;
var markers = [];
var placeMarkers = [];
var iHospitals = [{
    name: 'Abbott Northwestern Hospital',
    location: {
      lat: 44.9528739,
      lng: -93.2617964
    },
    place_id: 'ChIJXdyAav8n9ocRdMpjr5hMyz0',
    address: '800 E 28th St, Minneapolis, MN 55407'
  },
  {
    name: 'Hennepin County Medical Center',
    location: {
      lat: 44.9728387,
      lng: -93.26270439999999
    },
    place_id: 'Eig3MDEgUGFyayBBdmUsIE1pbm5lYXBvbGlzLCBNTiA1NTQwNCwgVVNB',
    address: '701 Park Ave, Minneapolis, MN 55404, USA'
  },
  {
    name: 'University of Minnesota Childrens Hospital',
    location: {
      lat: 44.9677403,
      lng: -93.2362141
    },
    place_id: 'ChIJ9QPoITkts1IRPSmDicBJrWE',
    address: 'University of Minnesota Amplatz Childrens Hospital, 2450 Riverside Ave, Minneapolis, MN 55455, USA'
  },
  {
    name: 'Allina Health',
    location: {
      lat: 44.94932319999999,
      lng: -93.2607785
    },
    place_id:'ChIJOzhUd_4n9ocR0WugRLOdVOc',
    address:'2925 Chicago Ave, Minneapolis, MN 55407, USA'
  },
  {
    name: 'Phillips Eye Institute',
    location: {
      lat: 44.9601427,
      lng: -93.26438999999999
    },
    place_id: 'ChIJi3Jn0q4ys1IRQNa4EzAuius',
    address:'2215 Park Ave, Minneapolis, MN 55404, USA'
  },
  {
    name: 'Shriners Hospitals for Children',
    location: {
      lat: 	44.958853,
      lng: -93.2108198
    },
    place_id: 'ChIJG4WVM9Iss1IReV-e2LWcITk',
    address: '2025 E River Pkwy, Minneapolis, MN 55414, USA'
  }
];

/**
###########  Hosipital Model data and behavior class ##########
**/
var HospitalModel = function(data) {
  var self = this;
  this.name = data.name;
  this.location = data.location;
  //this.title = observable(data.title);
  //this.position = data.position;
  //this.marker = new google.maps.Marker({
  //  map: map,
  //  position: this.position;
  //  name:this.name();
  //});
  //this.setVisible = ko.observable(true);
  //this.InfoWindowContent = data.InfoWindowContent;
  //this.marker.addListener('click', function () {
  //TODO displayContent(self.marker);
  //  animate(self.marker);
  //})
};
//#############################################################


//###Defines data and Behavior of UI
var appViewModel = function() {
  var self = this;
  this.HospitalList = ko.observableArray([]);
  this.filter = ko.observable("");
  //loop
  iHospitals.forEach(function(
    specificHopsital) {
    self.HospitalList.push(new HospitalModel(
      specificHopsital));
  });

  var infowindow = new google.maps
    .InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  self.HospitalList().forEach(function(
    location) {
    // define the marker
    var marker = new google.maps.Marker({
      map: map,
      position: location.location,
      title: location.name,
      animation: google.maps.Animation
        .DROP
    });

    location.marker = marker;

    location.marker.addListener(
      'click',
      function() {
        popInfoWindow(this,
          largeInfoWindow);
        animate(this);
      });

    bounds.extend(location.marker.position);

  });

  map.fitBounds(bounds);

  this.filteredLocations = ko.computed(
    function() {
      var filter = self.filter();
      if (!self.filter()) {
        self.HospitalList().forEach(
          function(location) {
            location.marker.setMap(map);
          });
        return self.HospitalList();
      } else {
        return ko.utils.arrayFilter(self.HospitalList(),
          function(loc) {
            if (loc.name.toLowerCase().indexOf(
                filter.toLowerCase()) !== -1) {
              loc.marker.setMap(map);
            } else {
              loc.marker.setMap(null);
            }
            return loc.name.toLowerCase()
              .indexOf(filter.toLowerCase()) !==
              -1;
          });
      }
    }, self);

  this.curMarker = ko.observable(
    this.HospitalList()[0]);

  //this is where the location is set once it has been clicked on
  //it also makes the marker bounce and infoWindow open when selected
  //from the list
  this.pointedLocation = function(
    selectedLocation) {
    animate(selectedLocation.marker);
    //populateInfoWindow(selectedLocation.marker,
    //largeInfoWindow);
    wikiInfo(selectedLocation.marker);
    self.curMarker(
      selectedLocation);
  };


  // TODO use this filter only when markers are setMap/rendered
  // in class prior viewModel
  this.filteredLocations1 = ko.computed(function() {
    var filter = self.filter().toLowerCase();
    if (!filter) {
      iHospitals.forEach(function(location) {
        if (location.marker) {
          location.marker.setVisible(true);
        }
      });
      return self.HospitalList;
    } else {
      return ko.utils.arrayFilter(location, function() {
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

// on that markers position.
function popInfoWindow(marker, infowindow) {
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


var infowindow;

function wikiInfo(marker) {
  var contentString = '';
  // load wikipedia data
  var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' +
    marker.title + '&format=json&callback=wikiCallback';
  var wikiRequestTimeout = setTimeout(function() {
    contentString = 'Failed to get wikipedia resources';
    infowindow.setContent(contentString);
    infowindow.open(map, marker);
  }, 6000);

  infowindow.open(map, marker);

  $.ajax({
    url: wikiUrl,
    dataType: 'jsonp',
    jsonp: 'callback',
    success: function(response) {

      var articleList = response[2];
      if (!articleList) {
        contentString = 'Data is not available.';
      } else {
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

function animate(marker) {
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {
    marker.setAnimation(null);
  }, 1400);
}

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
  infowindow = new google.maps.InfoWindow();
  ko.applyBindings(new appViewModel());
}
/** ---FourSquare API
Client ID
VN1PICLHTP5YBRBYBL33XOTLDUQVAA0PN1ULKHAVG51SSKYT
Client Secret
F1MXEKCLU1WI5TYXAHTWARUYZ3N1L4OPBEVL01E3EKSBDJHM
**/
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
