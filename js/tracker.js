import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { app } from './firebase.js'; // Make sure firebase.js exports `app`

const db = getDatabase(app);

// Get driver UID from the URL like ?uid=123
const urlParams = new URLSearchParams(window.location.search);
const driverUID = urlParams.get('uid');

let map;
let marker;

function initMap(lat, lng) {
  const location = { lat, lng };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: location,
  });

  marker = new google.maps.Marker({
    position: location,
    map: map,
    title: "Bus Location"
  });
}

function updateMarker(lat, lng) {
  const location = { lat, lng };
  marker.setPosition(location);
  map.setCenter(location);
}

// Start reading real-time updates from Firebase
function startTracking() {
  const locationRef = ref(db, `busLocations/${driverUID}`);

  onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.latitude && data.longitude) {
      const lat = data.latitude;
      const lng = data.longitude;

      if (!map) {
        initMap(lat, lng);
      } else {
        updateMarker(lat, lng);
      }
    } else {
      console.warn("No location data available for this driver.");
    }
  });
}

startTracking();
