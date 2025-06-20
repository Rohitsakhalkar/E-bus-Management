import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { app } from './firebase.js';

const db = getDatabase(app);
const urlParams = new URLSearchParams(window.location.search);
const driverUID = urlParams.get('uid');

let map, marker;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 15.85, lng: 74.5 },
    zoom: 15,
  });
  setTimeout(() => {
  google.maps.event.trigger(map, "resize");
}, 500);

  startTracking();
}

function startTracking() {
  if (!driverUID) {
    alert("Driver UID not found in URL!");
    return;
  }


  const locationRef = ref(db, `busLocations/${driverUID}`);
    
  onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.latitude && data.longitude) {
      const lat = data.latitude;
      const lng = data.longitude;

      if (!marker) {
        marker = new google.maps.Marker({
          map,
          position: { lat, lng },
          title: "Bus Location",
          icon: "https://maps.google.com/mapfiles/ms/icons/bus.png"
        });
      } else {
        marker.setPosition({ lat, lng });
      }

      map.setCenter({ lat, lng });
    } else {
      console.warn("No location data for driver:", driverUID);
    }
  });
}

// ✅ Wait for Maps to be ready, then manually init the map
window.addEventListener('load', () => {
  const waitForMaps = setInterval(() => {
    if (window.google && window.google.maps) {
      clearInterval(waitForMaps);
      initMap();
    }
  }, 100);
});
