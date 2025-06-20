
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { app } from './firebase.js';

const db = getDatabase(app);
const urlParams = new URLSearchParams(window.location.search);
const driverUID = urlParams.get('uid');

let map, marker;

window.initMap = () => {
  
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 15.85, lng: 74.5 },
    zoom: 15,
  });

  marker = new google.maps.marker.AdvancedMarkerElement({
  map,
  position: { lat, lng },
  title: "Bus Location",
});

  startTracking();
};

function startTracking() {
  if (!driverUID) {
    alert("Driver UID not found in URL!");
    return;
  }

  console.log("Tracking driver with UID:", driverUID);

  const locationRef = ref(db, `busLocations/${driverUID}`);

  onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    if (data && data.latitude && data.longitude) {
      const lat = data.latitude;
      const lng = data.longitude;

      marker.setPosition({ lat, lng });
      map.setCenter({ lat, lng });
    } else {
      console.warn("No location data for driver:", driverUID);
    }
  });
}
