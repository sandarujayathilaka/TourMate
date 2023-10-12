import React, { useState } from "react";
import vidBG from "../assert/vid.mp4";
import data from "../assert/data.json"
import bg from "../assert/bg.jpg"
import axios from "axios";
import { Link } from "react-router-dom";

function Main() {
  const [key, setkey] = useState("AIzaSyACdwaw1h6cATe6laoMWoayEniMemjgVkE");
  const [location, setLocation] = useState("galle");
  const [display, setDisplay] = useState(false);
  const [displayintro, setdisplayintro] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [dev, setdev] = useState([]);

  const addedLocations = []; 

async function addList(place) {
  const newPlace = {
    placeName2: place.name,
    userId: "user2",
    placeName: location,
    description: place.vicinity,
    lat: place.geometry.location.lat,
    long: place.geometry.location.lng,
    note: "",
  };

  // Check if the location already exists in the addedLocations array
  const locationExists = addedLocations.some(
    (existingLocation) =>
      existingLocation.lat === newPlace.lat &&
      existingLocation.long === newPlace.long
  );

  if (locationExists) {
    const message = "Place with the same location is already added.";
    alert(message); // Show an alert with the message
    return message; // Return a message indicating the result.
  }

  try {
    const response = await axios.post(
      "http://localhost:8080/wishlist/create",
      newPlace,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    console.log("List added:", response.data);

    // Update the recommendations state to include the new place
    // setRecommendations((prevRecommendations) => [...prevRecommendations, newPlace]);

    // Add the new location to the addedLocations array
    addedLocations.push({
      lat: newPlace.lat,
      long: newPlace.long,
    });

    const message = "Place added successfully.";
    alert(message); 
    return message; 
  } catch (error) {
    console.error("Error adding list:", error);
    const errorMessage = "Error adding place.";
    alert(errorMessage); 
    return errorMessage;
  }
}


  
  

  const rundev = () => {
    setdev(data);
    setdisplayintro(false);
    setDisplay(true);
  };

  const Explore = () => {
    if (!key) {
      alert("pleace enter api key");
    }
    setdisplayintro(false);
    setDisplay(true);
    fetchCoordinates();
  };

  const Options = () => {
    <div className="bg-white h-full"></div>;
  };

  const set = (event) => {
    setkey(event.target.value);
  };

  const setloc = (event) => {
    setLocation(event.target.value);
  };

  const fetchCoordinates = async () => {
    try {
      const apiKey = "AIzaSyACdwaw1h6cATe6laoMWoayEniMemjgVkE";
      const encodedPlaceName = encodeURIComponent(location);

      const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedPlaceName}&key=${apiKey}`;

      const response = await fetch(geocodeApiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch coordinates");
      }

      const data = await response.json();

      if (data.status === "ZERO_RESULTS") {
        throw new Error("No results found for the place name");
      }

      const { lat, lng } = data.results[0].geometry.location;

      // Make the POST request to your localhost server
      const apiUrl = "http://localhost:8080/places/fetchPlaces";
      const coordinates = { latitude: lat, longitude: lng };




      const postResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coordinates }),
      });


      if (!postResponse.ok) {
        throw new Error("Failed to send POST request");
      }

      const responseData = await postResponse.json();

      // Handle the response data as needed
      // console.log(responseData);
      //get req 
      //pass the location 
      //const responseData2 = await postResponse.json();

      
      setRecommendations(responseData);
    } catch (error) {}
  };

  const handleFetchRecommendations = async () => {
    setRecommendations([]);
    await fetchCoordinates();
  };

  return (
    <div>
      <div className="main">
      <div className="overlay bg-cover" style={{backgroundImage: `url(${bg})`}}>

      {displayintro && (
          <video src={vidBG} autoPlay loop muted />
      )}

          
          {displayintro && (
            
            <div className="h-[330px] top-[25%] backdrop-blur-sm bg-white/30 bg content absolute inset-0 flex flex-col justify-center items-center space-y-4">
              
              
{/* <ol class="relative border-l border-gray-200 dark:border-gray-700">                  
    <li class="mb-10 ml-6">            
        <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
            <svg class="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
            </svg>
        </span>
        <h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Flowbite Application UI v2.0.0 <span class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ml-3">Latest</span></h3>
        <time class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Released on January 13th, 2022</time>
        <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Get access to over 20+ pages including a dashboard layout, charts,.</p>
        <a href="#" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"><svg class="w-3.5 h-3.5 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z"/>
    <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
  </svg> Download ZIP</a>
    </li>

    <li class="mb-10 ml-6">            
        <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
            <svg class="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
            </svg>
        </span>
        <h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Flowbite Application UI v2.0.0 <span class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ml-3">Latest</span></h3>
        <time class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Released on January 13th, 2022</time>
        <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Get access to over 20+ pages including a dashboard layout, charts,.</p>
        <a href="#" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"><svg class="w-3.5 h-3.5 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z"/>
    <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
  </svg> Download ZIP</a>
    </li>

</ol> */}

              <h1 className="text-[60px] text-white font-bold text-stroke-black-2 ">WELCOME TO TOURMATE</h1>
              <p className="text-white text-[30px]"></p> 

              <div className="flex">
                <input
                  type="text"
                  id="disabled-input"
                  aria-label="disabled input"
                  onChange={setloc}
                  placeholder="Enter desination"
                  className="h-[40px] bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={Explore}
                  className="text-white w-[100px] h-[40px] ml-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                  Explore
                </button>
                

                {/* <Link to={`/updateNote/${placeName}`}> */}
                <Link to={'/wishlist'}>
                <button
                  type="button"
                  className="text-white w-[100px] h-[40px] ml-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                  Cancel
                </button>
                </Link>
              </div>
              {/* <h1 className="text-white text-[15px] opacity-60">
                Dev options: Enter API key (this will be removed in production)
              </h1>
              <div className="flex">
                <input
                  type="text"
                  id="disabled-input"
                  aria-label="disabled input"
                  className="h-[40px] bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={set}
                />

                <button
                  type="button"
                  className="mb-3 text-white w-[100px] h-[40px] ml-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 "
                >
                  Set
                </button>
              </div> */}
            </div>
          )}

          {display && (
            <div className=" backdrop-blur-sm bg-white/30 bg content absolute inset-0 flex flex-col justify-center items-center space-y-4">
              <h1 className="text-[70px] uppercase font-bold text-white">{location}</h1>
              <div className="max-h-[600px] overflow-y-auto">    
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {recommendations.results ? (
                      recommendations.results.map((place, index) => (
                      <div
                        key={index}
                        class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col"
                      >
                        <a href="#">
                          {place.photos ? (
                            <img
                              className="h-64 w-full rounded-t-lg bg-auto bg-center"
                              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=AIzaSyACdwaw1h6cATe6laoMWoayEniMemjgVkE`}
                             // src={'https://lh3.googleusercontent.com/places/ANJU3DuzZi-_27Ng216qFCWfZI9xvnKJfrBRWvVXlF57u-myMIj-Y-R-G619mC8TAWbFTDZOD1u4BTKr4RddF92HHkXRZCpBHqdLOXs=s1600-w400'}
                              alt=""
                            />
                          ) : null}
                        </a>
                        <div class="p-5">
                          <a href="#">
                            {place.photos ? (
                                 <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                 {place.name}
                               </h5>
                            ):null}
                          </a>

                          {place.photos ? (
                          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                          {place.vicinity}
                          </p>
                          ):null}
                         
                        </div>
                        <div class="flex-grow"></div>{" "}
                        {/* Pushes "Read more" to the bottom */}
                        {place.photos ? (
                        <div class="p-5">
                          <div class="flex items-center mt-2.5 mb-5">
                            {[...Array(5)].map((_, starIndex) => (
                              <svg
                                key={starIndex}
                                class={`w-4 h-4 ${
                                  starIndex < Math.round(place.rating)
                                    ? "text-yellow-300"
                                    : "text-gray-200 dark:text-gray-600"
                                }`}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 22 20"
                              >
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                              </svg>
                            ))}
                            <span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
                              {place.rating}
                            </span>
                          </div>
                          <button
                           onClick={() => addList(place)}
                            href="#"
                            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            Add to list
                            <svg
                              class="w-3.5 h-3.5 ml-2"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 10"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                              />
                            </svg>
                          </button>                          
                        </div>
                         ) : null}
                      </div>
                    ))
                  ) : (
                    <p>No recommendations available.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;
