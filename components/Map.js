import { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import getCenter from "geolib/es/getCenter";
import { LocationMarkerIcon } from "@heroicons/react/solid";

function Map({ searchResults }) {
  const [selectedLocation, setSelectedLocation] = useState({});

  // Transform the search results to
  // { latitude: xxx, longitude: xxx }
  const coords = searchResults.map((result) => ({
    latitude: result.lat,
    longitude: result.long,
  }));

  // The center location of coordinates
  const center = getCenter(coords);

  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: center.latitude,
    longitude: center.longitude,
    zoom: 11,
  });

  return (
    <ReactMapGL
      mapStyle="mapbox://styles/gyunbie/ckv9j7oy53bnx15t5zmxmsqb2"
      mapboxApiAccessToken={process.env.mapbox_key}
      {...viewport}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      {searchResults.map((result) => (
        <div key={result.long}>
          <Marker longitude={result.long} latitude={result.lat}>
            <p
              role="img"
              onClick={() => setSelectedLocation(result)}
              className="cursor-pointer text-2xl"
              aria-label="push-pin"
            >
              {" "}
              📍{" "}
            </p>
          </Marker>

          {/* Marker popup */}
          {selectedLocation.long === result.long ? (
            <Popup
              closeOnClick={true}
              onClose={() => setSelectedLocation({})}
              latitude={result.lat}
              longitude={result.long}
            >
              {result.title}
            </Popup>
          ) : (
            false
          )}
        </div>
      ))}
    </ReactMapGL>
  );
}

export default Map;
