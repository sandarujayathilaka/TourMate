import React, { useState, useEffect } from "react";
import i18nIsoCountries from "i18n-iso-countries";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Autocomplete } from '@react-google-maps/api';
import back from "../assert/back.jpeg"
import slide1 from "../assert/slide1.jpg"
import slide2 from "../assert/slide2.jpg"
import slide3 from "../assert/slide3.jpg"
import { Helmet } from 'react-helmet-async';
import { Link, useParams,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import { Line } from 'react-chartjs-2';
import logo from '../assert/re.png';
i18nIsoCountries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const api = {
  openWeatherMapKey: "f8358e088ce7977e04d5ef56c9e7c3bb",
  googlePlacesKey: "AIzaSyACdwaw1h6cATe6laoMWoayEniMemjgVkE", // Replace with your Google Places API key
};

function Home(props) {
//  const { auth } = useAuth();
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageFav, setErrorMessageFav] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [places, setPlaces] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("suggested");
  const images = [slide1,back,slide2,slide3];
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  //const indicesToInclude = [3, 11, 19, 27, 35, 39];
  const [chartData, setChartData] = useState({});

  const backgroundImageStyle = {
    backgroundImage: `url(${logo})`,
  };
const goToPreviousImage = () => {
  setCurrentImageIndex((prevIndex) =>
    prevIndex === 0 ? images.length - 1 : prevIndex - 1
  );
};

// Define a function to handle moving to the next image
const goToNextImage = () => {
  setCurrentImageIndex((prevIndex) =>
    prevIndex === images.length - 1 ? 0 : prevIndex + 1
  );
};
const currentImage = images[currentImageIndex];

useEffect(() => {
  const interval = setInterval(goToNextImage, 5000); // Change image every 5 seconds
  return () => {
    clearInterval(interval);
  };
}, []);

  
  
        
        
        


  const fetchCityCoordinates = async () => {
    try {
      const response = await axios.get('api/place', {
        params: {
          name: search,
          key: api.googlePlacesKey,
        },
      });
  
      const results = response.data.results;
  
      if (results.length > 0) {
        const location = results[0].geometry.location;
        const lat = location.lat;
        const lng = location.lng;
  
        setMapCenter({ lat, lng });
        fetchNearbyPlaces(lat, lng);
        fetchData(lat, lng);
      //  fetchWeather(lat, lng);
        // fetchNearbyFavPlaces(lat,lng);
      } else {
        setErrorMessage('City not found.');
        setPlaces([]);
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching data.');
      setPlaces([]);
    }
  };
  

  const fetchNearbyPlaces = (lat, lon, initialRadius = 10000) => {
    const keyword = ['tourist_attraction'];
    const fetchWithAdjustedRadius = async (adjustedRadius) => {
      try {
        const response = await axios.get('/api/places', 
        {
          params: {
            lat: lat,
            lon: lon,
            radius: adjustedRadius,
            keyword: keyword.join('|'),
            apiKey: api.googlePlacesKey,
          },
        });
        
        
        

        const result = response.data;
  
        console.log(result)

        if (result.status === 'OK') {
          const placesWithWeatherPromises = result.results.map((place) => {
            return axios.get('https://api.openweathermap.org/data/2.5/weather', {
              params: {
                lat: place.geometry.location.lat,
                lon: place.geometry.location.lng,
                units: 'metric',
                appid: api.openWeatherMapKey,
              },
            });
          });
  
          console.log(placesWithWeatherPromises)

          const weatherResponses = await Promise.all(placesWithWeatherPromises);
  
          console.log(weatherResponses)

          const placesWithWeather = weatherResponses.map((weatherResponse, index) => {
            const place = result.results[index];
            const weatherData = weatherResponse.data;
  
            place.weather = {
              temperature: weatherData.main.temp,
              humidity: weatherData.main.humidity,
              windSpeed: weatherData.wind.speed,
            };
  
            return place;
          });
       //   console.log(weatherResponses)
          

    //       const filteredPlaces = placesWithWeather.filter((place) =>
    //         place.types.every((type) => keyword.includes(type))
    //       );
  
    //    //   console.log('Place Types:', place.types);
    //       console.log('Keyword:', keyword);
          
       //   console.log(placesWithWeather)

          return placesWithWeather;
        } else {
          return [];
        }
      } catch (error) {
        console.error('Error fetching and filtering data:', error);
        return [];
      }
    };
  
    return fetchWithAdjustedRadius(initialRadius)
      .then((placesWithWeather) => {
        setPlaces(placesWithWeather);
        
      })
      .catch((error) => {
        console.error('Error fetching and filtering data:', error);
        setPlaces([]);
      });
  };
  
  // const fetchWeather = async(lat, lon) => {
    
  //     try {
  //       const response = await axios.get('/api/weather', 
  //       {
  //         params: {
  //           lat: lat,
  //           lng: lon,
  //         },
  //       });
        
        
        

  //       const result = response.data;
  
  //       console.log(result)
  //     } catch (error) {
  //       console.error('Error fetching and filtering data:', error);
  //       return [];
  //     }
    
  // };

  

  const fetchData = async (lat, lng) => {
    try {
      console.log(lat, lng);
      const response = await axios.get(`/weather`, {
        params: {
          lat: lat,
          lon: lng,
        },
      });
  
      const weatherData = response.data;
  
      if (weatherData.list && Array.isArray(weatherData.list)) {
        // Create a Set to store unique dates
        const uniqueDates = new Set();
  
        // Filter and save only one record per date
        const uniqueWeatherData = weatherData.list.filter((item) => {
          if (item.dt_txt) {
            const itemDate = new Date(item.dt_txt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            });
  
            if (!uniqueDates.has(itemDate)) {
              uniqueDates.add(itemDate);
              return true; // Include this record
            }
          }
  
          return false; // Exclude this record
        });
  
        // Set the unique weather data in your state
        setWeatherData({ list: uniqueWeatherData });
        console.log(uniqueWeatherData);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setSearchPerformed(true);
        setSearch(place.formatted_address);
        fetchCityCoordinates(); // Trigger the search automatically
     
    }
    }
  };

  const handleSearchButtonClick = () => {
    if (search) {
      setSearchPerformed(true);
      fetchCityCoordinates(); // Trigger the search using the entered search term
    }
  };
  
 //console.error(chartData);
 
  return (
    <div className="App bg-slate-300 h-full">
         {/* bg-image w-full h-screen bg-opacity-90 */}
      <header className="App-header">
    {/* <div>{user}</div> */}
      <Autocomplete
        onLoad={autocomplete => setAutocomplete(autocomplete)}
        onPlaceChanged={handlePlaceChanged}
      >
        <div className="flex justify-center mt-10 mb-4">
          <input
            type="text"
            placeholder="Enter city/town to visit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-70 p-2 mr-2 mt-5 rounded-l border border-black"
          />
          <datalist id="suggestions">
            {suggestions.map((item, index) => (
              <option key={index} value={item} />
            ))}
          </datalist>
          <button
            onClick={handleSearchButtonClick}
            className="w-35 bg-blue-500 text-white p-2 mt-5 rounded-r hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </Autocomplete>
      {!searchPerformed && (
       <div className="bg-cover bg-center bg-no-repeat h-screen relative" style={backgroundImageStyle}>
       <div className="absolute inset-0 flex items-center justify-center">
       <div className="text-white text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold w-3/4 max-w-2xl px-4 mt-10 mb-10">
           <p className="animate-fade-in">Discover great places with our TourMate website and maintain your records to get wonderful suggestions!</p>
         </div>
       </div>
       <div className="absolute inset-0 flex items-center justify-end">
         <div className="flex">
           {/* Box 1 */}
           <div className="w-1/4 p-4">
             <div className="bg-white p-4 rounded-md">
               <img src="image1.jpg" alt="Image 1" className="w-3/4 mx-auto" />
               <p className="text-center">Personalized recommendations</p>
             </div>
           </div>
 
           {/* Box 2 */}
           <div className="w-1/4 p-4">
             <div className="bg-white p-4 rounded-md">
               <img src="image2.jpg" alt="Image 2" className="w-3/4 mx-auto" />
               <p className="text-center">6-day weather forecast</p>
             </div>
           </div>
 
           {/* Box 3 */}
           <div className="w-1/4 p-4">
             <div className="bg-white p-4 rounded-md">
               <img src="image3.jpg" alt="Image 3" className="w-3/4 mx-auto" />
               <p className="text-center">Hidden gems</p>
             </div>
           </div>
 
           {/* Box 4 */}
           <div className="w-1/4 p-4">
             <div className="bg-white p-4 rounded-md">
               <img src="image4.jpg" alt="Image 4" className="w-3/4 mx-auto" />
               <p className="text-center">Nearby Places with weather and direction</p>
             </div>
           </div>
           <div className="w-1/4 p-4">
             <div className="bg-white p-4 rounded-md">
               <img src="image4.jpg" alt="Image 4" className="w-3/4 mx-auto" />
               <p className="text-center">Tour Package</p>
             </div>
           </div>
           <div className="w-1/4 p-4">
             <div className="bg-white p-4 rounded-md">
               <img src="image4.jpg" alt="Image 4" className="w-3/4 mx-auto" />
               <p className="text-center">Secret Spot Map</p>
             </div>
           </div>
         </div>
       </div>
     </div>

      )}


      {searchPerformed && (
        <div>
        
    <div>
    <h2 className="text-center">6-Day Forecast </h2>
    
          <div className="flex justify-between bg-gray-400 mt-4 mb-4 ml-20 mr-20 rounded-lg">
          
          {weatherData && weatherData.list.map((item, index)=> {
  if (weatherData.list && weatherData.list.length > index) {
    const item = weatherData.list[index];
    const itemDate = new Date(item.dt_txt);
    const dayOfWeek = itemDate.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = itemDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return (
      <div key={index} className="m-4">
        <p className="text-lg font-semibold ">{dayOfWeek}</p>
        <p className="text-sm">{formattedDate}</p>
        <p>Min: {item.main.temp}°C</p>
        <p>Max: {item.main.feels_like}°C</p>
        <p>Humidity: {item.main.humidity}%</p>
        <p>Wind Speed: {item.wind.speed} km/h</p>
        <p><img
  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
  alt={item.weather[0].description}
/>{item.weather[0].description}
</p>
        {/* Add more relevant data as needed */}
      </div>
    );
  } else {
    // Handle the case where the index is out of bounds or weatherData.list is empty
    return null; // or any other suitable action
  }
})}

          </div> 
    </div>
    <div className="flex justify-center mt-4 mb-4">

          <button
            onClick={() => setActiveTab("suggested")}
            className={`${
              activeTab === "suggested" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
            } p-2 w-1/4 rounded-l hover:bg-blue-600`}
          >
            Suggested Places
          </button>
          <button
            onClick={() => setActiveTab("hidden")}
            className={`${
              activeTab === "hidden" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
            } p-2 w-1/4 hover:bg-blue-600`}
          >
            Hidden Places
          </button>
          <button
            onClick={() => setActiveTab("favorite")}
            className={`${
              activeTab === "favorite" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
            } p-2 w-1/4 hover:bg-blue-600`}
          >
            Favorite Places
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`${
              activeTab === "experience" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
            } p-2 w-1/4 rounded-r hover:bg-blue-600`}
          >
            Experience
          </button>
        </div>

        {activeTab === "suggested" && (
          <div>
      {places.length > 0 && (
        <div>
        <h1 className="text-2xl font-bold ml-4 mb-4">Suggested Places</h1>
        {errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <div>
            <div className="grid grid-cols-4 gap-4 overflow-x-auto">
              {places.map((place, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-gray-100 rounded-lg p-4 shadow-md mb-4 ml-4 mr-4"
                >
                  <div className="mb-2">
                    {place.photos && place.photos.length > 0 ? (
                      <img
                        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${api.googlePlacesKey}`}
                        alt={`Photo of ${place.name}`}
                        className="w-50 h-50 rounded-t-lg"
                      />
                    ) : (
                      <p className="w-full h-40 flex items-center justify-center bg-gray-200 text-gray-400 rounded-t-lg">Image not found</p>
                    )}
                  </div>

                  <div className="mb-2">
                    <h3 className="text-lg font-semibold">{place.name}</h3>
                    <p className="text-gray-600">{place.vicinity}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <div>
                      <p>Temperature: {place.weather.temperature}°C</p>
                      <p>Humidity: {place.weather.humidity}%</p>
                      <p>Wind Speed: {place.weather.windSpeed} km/h</p>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat},${place.geometry.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Get Directions
                      </a>
                    </div>
                  
                  </div>
                </div>
              ))}
            </div>
          </div>
         
        )}

      



       

</div>
      )}
 </div>
        )}
        {activeTab === "hidden" && (
          <div>
            {/* Render content related to Hidden Places */}
          </div>
        )}

        {activeTab === "favorite" && (
          <div>
            <h1 className="text-2xl font-bold ml-4 mb-4 mt-10">Favorite Places</h1>
        {errorMessageFav ? (
          <p className="text-red-500">{errorMessageFav}</p>
        ) : (
          <div>
            <div className="grid grid-cols-4 gap-4 overflow-x-auto">
            {favoritePlaces.map((place, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-gray-100 rounded-lg p-4 shadow-md mb-4 ml-4 mr-4"
                >
                  <div className="mb-2">
                    {place.image ? (
                      <img
                      src={place.image}
                      alt={place.placeName}
                      className="w-full h-40 object-cover"
                    />
                    ) : (
                      <p className="w-full h-40 flex items-center justify-center bg-gray-200 text-gray-400 rounded-t-lg">Image not found</p>
                    )}
                  </div>

                  <div className="mb-2">
                    <h3 className="text-lg font-semibold"> {place.placeName}</h3>
                    <p className="text-gray-600"> Visited Date: {place.visitedDate}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    {/* <div>
                      <p>Temperature: {place.weather.temperature}°C</p>
                      <p>Humidity: {place.weather.humidity}%</p>
                      <p>Wind Speed: {place.weather.windSpeed} km/h</p>
                    </div>
                    <div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat},${place.geometry.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Get Directions
                      </a>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        )}
          </div>
        )}

        {activeTab === "experience" && (
          <div>
            {/* Render content related to Experience */}
          </div>
        )}
      </div>
      )}
      </header>
    </div>
  );
}

export default Home;
