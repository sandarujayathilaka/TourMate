import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  LoadScript,
  Polyline,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";
import map from "../../assert/map1.png";

const containerStyle = {
  width: "100%",
  height: "900px",
};

const libraries = ["geometry", "directions"];
const PROXIMITY_THRESHOLD = 500;

const center = {
  lat: 7.8731, // Default center for the map
  lng: 80.7718,
};

function Map() {
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [directions, setDirections] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherNear, setNearWeather] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [nearestPlace, setNearestPlace] = useState(null);
  const [nearestPlaceone, setIsNearFavoritePlace] = useState(false);
  const [showNearestPlaceInfo, setShowNearestPlaceInfo] = useState(true);
  const [nearestDistance, setNearestDistance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    async function fetchFavoritePlaces() {
      try {
        const response = await axios.get(
          "http://localhost:8080/favplace/gethidden"
        );

        const placesWithCoordinates = await getCoordinatesForPlaces(
          response.data.place
        );
        console.log(placesWithCoordinates);
        setFavoritePlaces(placesWithCoordinates);
      } catch (error) {
        console.error("Error fetching favorite places:", error);
      }
    }

    fetchFavoritePlaces();
  }, []);

  async function getCoordinatesForPlaces(places) {
    const placesWithCoordinates = [];

    for (const place of places) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            place.location
          )}&key=AIzaSyACdwaw1h6cATe6laoMWoayEniMemjgVkE`
        );

        const result = response.data.results[0];
        if (result) {
          const { lat, lng } = result.geometry.location;
          placesWithCoordinates.push({
            ...place,
            latitude: lat,
            longitude: lng,
          });
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    }

    return placesWithCoordinates;
  }

  useEffect(() => {
    // Update pathCoordinates when favoritePlaces are updated
    setPathCoordinates(
      favoritePlaces.map((place) => ({
        lat: place.latitude,
        lng: place.longitude,
      }))
    );
  }, [favoritePlaces]);

  const handleDirectionsClick = (place) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const directionsService = new window.google.maps.DirectionsService();

          // Specify the origin and destination
          const origin = new window.google.maps.LatLng(
            userLocation.lat,
            userLocation.lng
          );
          const destination = new window.google.maps.LatLng(
            place.latitude,
            place.longitude
          );

          // Calculate directions
          directionsService.route(
            {
              origin: origin,
              destination: destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                setDirections(result);

                // Extract and set the distance and duration
                const route = result.routes[0];
                if (route && route.legs && route.legs[0]) {
                  setDistance(route.legs[0].distance.text);
                  setDuration(route.legs[0].duration.text);
                } else {
                  setDistance(null);
                  setDuration(null);
                }
              } else {
                console.error(`Error fetching directions: ${status}`);
              }
            }
          );
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    // Update weather data when selectedPlace changes
    if (selectedPlace) {
      console.log(selectedPlace);
      fetchWeather(selectedPlace.latitude, selectedPlace.longitude);
    } else {
      setWeather(null); // Clear weather data when no marker is selected
    }
  }, [selectedPlace]);

  const fetchWeather = async (lat, lng) => {
    try {
      // Replace with your weather API key and API endpoint
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=630c69f94c458f628031272842978ea3&units=metric`
      );

      const weatherData = response.data;

      setWeather(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  function calculateNearestPlace(userLocation) {
    if (favoritePlaces.length === 0) {
      return null;
    }

    let nearestPlace = favoritePlaces[0];
    let nearestDistance = getDistance(
      userLocation.lat,
      userLocation.lng,
      nearestPlace.latitude,
      nearestPlace.longitude
    );

    for (const place of favoritePlaces) {
      const distance = getDistance(
        userLocation.lat,
        userLocation.lng,
        place.latitude,
        place.longitude
      );

      if (distance < nearestDistance) {
        nearestPlace = place;
        nearestDistance = distance;
      }
    }

    return nearestPlace;
  }

  useEffect(() => {
    if (nearestPlace) {
      setNearestPlace(nearestPlace);
    }
  }, [nearestPlace]);

  const checkProximityToFavoritePlaces = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLocationData); // Update userLocation state

          // Calculate the nearest place
          const nearest = calculateNearestPlace(userLocationData);
          setNearestPlace(nearest);

          // Check proximity to each favorite place (optional)
          const isNear = favoritePlaces.some((place) => {
            const placeLocation = {
              lat: place.latitude,
              lng: place.longitude,
            };

            const distance = getDistance(
              userLocationData.lat,
              userLocationData.lng,
              placeLocation.lat,
              placeLocation.lng
            );

            return distance <= PROXIMITY_THRESHOLD;
          });

          setIsNearFavoritePlace(isNear);

          // Set showNearestPlaceInfo to true when the nearest place is found
          if (isNear) {
            setShowNearestPlaceInfo(true);
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [favoritePlaces]);

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  useEffect(() => {
    checkProximityToFavoritePlaces();
  }, [checkProximityToFavoritePlaces]);

  const fetchNearestPlaceWeather = async (nearestPlace) => {
    if (nearestPlace) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${nearestPlace.latitude}&lon=${nearestPlace.longitude}&appid=630c69f94c458f628031272842978ea3&units=metric`
        );

        const weatherData = response.data;
        setNearWeather(weatherData);
      } catch (error) {
        console.error(
          "Error fetching weather data for the nearest place:",
          error
        );
      }
    }
  };

  const fetchNearestPlaceData = async (nearestPlace) => {
    if (nearestPlace) {
      try {
        // Fetch weather data
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${nearestPlace.latitude}&lon=${nearestPlace.longitude}&appid=630c69f94c458f628031272842978ea3&units=metric`
        );

        const weatherData = weatherResponse.data;
        setNearWeather(weatherData);

        // Calculate the distance
        const distance = getDistance(
          nearestPlace.latitude,
          nearestPlace.longitude,
          userLocation.lat,
          userLocation.lng
        );

        setNearestDistance(distance);
      } catch (error) {
        console.error("Error fetching data for the nearest place:", error);
      }
    }
  };

  useEffect(() => {
    // Update weather data when nearestPlace changes
    fetchNearestPlaceWeather(nearestPlace);
    fetchNearestPlaceData(nearestPlace);
  }, [nearestPlace]);

  console.log(nearestDistance);
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyACdwaw1h6cATe6laoMWoayEniMemjgVkE"
      libraries={libraries}
    >
      <div className="flex">
        {/* Left Side: Information about Nearest Place */}
        <div className="w-1/4 p-4 bg-white shadow">
          {/* Display information about the nearest place when available */}
          {nearestPlace && (
            <div>
              <h2 className="text-3xl font-bold mb-5">Nearest Hidden Place</h2>
              <img
                src={nearestPlace.image}
                alt={nearestPlace.placeName}
                className="w-full h-40 object-cover mb-5 rounded-lg"
              />

              <p className="text-2xl font-bold text-blue-950">
                {nearestPlace.placeName}
                {weatherNear && (
                  <span className="ml-3">
                    {parseFloat(weatherNear.main.temp) > 30 ? (
                      <span>
                        <span className="text-xl ml-32 relative font-bold text-orange-500">
                          {weatherNear.main.temp}°C
                        </span>
                        <br />
                      </span>
                    ) : parseFloat(weatherNear.main.temp) >= 25 &&
                      parseFloat(weatherNear.main.temp) <= 29 ? (
                      <span>
                        <span className="text-xl font-bold ml-32 relative text-green-500">
                          {weatherNear.main.temp}°C
                        </span>
                        <br />
                      </span>
                    ) : (
                      <span>
                        <span className="text-xl ml-32 relative font-bold text-sky-700">
                          {weatherNear.main.temp}°C
                        </span>
                        <br />
                      </span>
                    )}
                    <span className="text-xl ml-64 font-bold text-sky-700">
                      {weatherNear.weather[0].description}
                    </span>
                  </span>
                )}
              </p>

              {/* Display current weather information for the nearest place */}

              {/* Display distance from user's current location */}
              {nearestDistance !== null && (
                <div className="mt-5">
                  <hr></hr>
                  <img
                    src={map}
                    alt="map logo"
                    className="w-5%  object-cover"
                  />
                  <h3 className="mt-4 text-2xl font-bold mb-3"></h3>
                  <p className="text-xl font-bold text-blue-950">
                    <span className=" text-2xl text-sky-700">
                      {nearestDistance.toFixed(2)} km
                    </span>{" "}
                  </p>
                </div>
              )}

              <div className="mt-5">
                <hr></hr>
                <h3 className="mt-4 text-2xl font-bold mb-3">Description</h3>
                <p className="text-base  text-blue-950">
                  <textarea className="w-96 h-40 text-lg" disabled>
                    {nearestPlace.description}
                  </textarea>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="w-3/4">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={8}
          >
            {favoritePlaces.map((place, index) => (
              <Marker
                key={index}
                position={{ lat: place.latitude, lng: place.longitude }}
                title={place.placeName}
                onClick={() => setSelectedPlace(place)} // Set selected place when marker is clicked
              />
            ))}
            {selectedPlace && (
              <InfoWindow
                position={{
                  lat: selectedPlace.latitude,
                  lng: selectedPlace.longitude,
                }}
                onCloseClick={() => setSelectedPlace(null)} // Clear selected place when InfoWindow is closed
              >
                {/* InfoWindow content */}
                <div>
                  {selectedPlace && (
                    <div>
                      <button
                        onClick={() => handleDirectionsClick(selectedPlace)}
                      >
                        Get Directions
                      </button>
                    </div>
                  )}

                  <img
                    src={selectedPlace.image}
                    alt={selectedPlace.placeName}
                    className="w-full h-40 object-cover"
                  />
                  <h2>{selectedPlace.placeName}</h2>
                  <p>Visited Date: {selectedPlace.visitedDate}</p>

                  {weather && (
                    <div>
                      <h3>Weather Information</h3>
                      <p className="text-black">
                        Temperature: {weather.main.temp}°C
                      </p>
                      <p>Weather Condition: {weather.weather[0].description}</p>
                    </div>
                  )}

                  {distance && duration && (
                    <div>
                      <h3>Directions</h3>
                      <p>Distance: {distance}</p>
                      <p>Duration: {duration}</p>
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
            {/* Draw the polyline connecting favorite places */}
            {/* {pathCoordinates.length > 0 && (
              <Polyline
                path={pathCoordinates}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 1,
                  strokeWeight: 2,
                }}
              />
            )} */}
            {/* Display directions on the map */}
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  polylineOptions: {
                    strokeColor: "#007bff",
                  },
                }}
              />
            )}
            {nearestPlace && (
              <Marker
                position={{
                  lat: nearestPlace.latitude,
                  lng: nearestPlace.longitude,
                }}
                title="Nearest Place"
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  fillColor: "#00FF00",
                  fillOpacity: 0.7,
                  strokeWeight: 0,
                  scale: 10,
                }}
              />
            )}
          </GoogleMap>
        </div>
      </div>
    </LoadScript>
  );
}

export default Map;