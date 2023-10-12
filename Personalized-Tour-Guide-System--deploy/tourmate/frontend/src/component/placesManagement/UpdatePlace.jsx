import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import slide from "../../assert/back1.jpg";
import slide1 from "../../assert/addback.avif";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";


function UpdatePlace() {

    const param = useParams();
    const id = param.id;
     const { auth } = useAuth();
     const { user } = auth;
    
    const [place, setPlace] = useState({});
    const [newPlaceName, setPlaceName] = useState("");
    const [newUserId, setUserId] = useState("");
    const [newCategory, setCategory] = useState("");
    const [newVisitedDate, setVisitedDate] = useState("");
    const [newLocation, setLocation] = useState("");
    const [newContact, setContact] = useState("");
    const [newImage, setImage] = useState("");
    const [newPlaceType, setPlaceType] = useState("");
    const [newDescription, setDescription] = useState("");
    const [currentLocation, setCurrentLocation] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

     async function getPlace() {
    try {
 
      const res = await axios.get(`http://localhost:8080/favplace/getanyplace/${id}`);
      const onePlace = res.data;

      setPlace(onePlace.place[0]);
      console.log(onePlace)
    } catch (err) {
      alert(err);
    }
  }

   useEffect(() => {
    getPlace()
  }, []);

   useEffect(() => {

    setUserId(place.userId);
    setPlaceName(place.placeName);
    setCategory(place.category);
    setVisitedDate(place.visitedDate);
    setLocation(place.location);
    setContact(place.contact);
    setImage(place.image);
    setDescription(place.description);
    setPlaceType(place.placeType);
  
  }, [place]);

  async function UpdateData(e) {
    e.preventDefault();

    try {
      const updatePlace = {
        newPlaceName,
        newUserId,
        newCategory,
        newVisitedDate,
        newLocation,
        currentLocation,
        newContact,
        newImage,
        newDescription,
        newPlaceType,
      };
      
      await axios.put(
        `http://localhost:8080/favplace/updateplace/${id}`,updatePlace);

      toast.success(" Updated Successfully", {
        autoClose: 1000,
      });
      setTimeout(() => (window.location.href = `/displayhidden/${user}`), 1000);
    } catch (err) {
      alert(err);
    }
  }

   
  function convertToBase64(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error:", error);
    };
  }

  const containerStyle = {
    backgroundImage: `url(${slide})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

   const initializeGeolocation = () => {
    console.log("call")
     if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
         (position) => {
           const { latitude, longitude } = position.coords;
           setCurrentLocation(`${latitude},${longitude}`);
           fetchLocationName(latitude, longitude);
         },
         (error) => {
           console.error("Error fetching current location:", error);
         }
       );
     } else {
       console.log("Geolocation is not supported by this browser.");
     }
   };

   const fetchLocationName = async (latitude, longitude) => {
     setLatitude(latitude);
     setLongitude(longitude);
     try {
       const response = await axios.get(
         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyACdwaw1h6cATe6laoMWoayEniMemjgVkE`
       );

       const formattedAddress = response.data.results[0].formatted_address;
       setCurrentLocation(formattedAddress);
     } catch (error) {
       console.error("Error fetching location name:", error);
     }
   };


  


  return (
    <>
      <div
        style={containerStyle}
        className="min-h-screen p-6 flex items-center justify-center"
      >
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <h2 className="font-bold text-5xl text-center text-black-600">
              Keep Your Favourite Place Details Updated
            </h2>
            <p className="text-gray-500 text-center text-2xl mb-6"></p>
            <p className="text-gray-500 text-center text-2xl mb-6">
              "Capture your journey, memorize your trip, and inspire fellow
              explorers by sharing hidden places. Add to the adventure today!"
            </p>
            <br />

            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-gray-600">
                  <img
                    src={slide1}
                    className="w-full h-96 object-cover custom-image"
                  />
                </div>

                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-2">
                    <div className="md:col-span-2 text-xl font-semibold">
                      <label htmlFor="placeName">Place Name</label>
                      <input
                        type="text"
                        name="placeName"
                        id="placeName"
                        className="h-10 border mt-1 rounded px-4 w-full text-gray-600 bg-gray-50 text-base"
                        value={newPlaceName}
                        onChange={(e) => setPlaceName(e.target.value)}
                      />
                    </div>
                    <p className="text-gray-500 text-center text-lg mb-2"></p>

                    <div className="md:col-span-2 text-xl font-semibold">
                      <label htmlFor="category">Category</label>
                      <p className="mb-3"></p>
                      <select
                        name="category"
                        value={newCategory}
                        required
                        id="category"
                        onChange={(e) => {
                          setCategory(e.target.value);
                        }}
                        class="border py-2 px-3 text-grey-800 w-full text-gray-600 rounded-xl text-base"
                      >
                        <option selected disabled hidden>
                          Choose Category
                        </option>
                        <option value="Favourite Hotel">Favourite Hotel</option>
                        <option value="Favourite Place">
                          Favourite Attractive Place
                        </option>
                        <option value="Hidden Place">
                          {" "}
                          Favourite Hidden Place
                        </option>
                      </select>
                    </div>
                    <p className="text-gray-500 text-center text-lg mb-2"></p>

                    <div className="md:col-span-2  text-xl font-semibold">
                      <label htmlFor="location">Location</label>
                      <div className="flex">
                        <input
                          type="text"
                          name="location"
                          id="location"
                          className="h-10 border mt-1 rounded px-4 w-full text-gray-600 bg-gray-50 text-base"
                          value={currentLocation || newLocation}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                        <button
                          className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded text-base"
                          onClick={initializeGeolocation}
                        >
                          Location
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-500 text-center text-lg mb-2"></p>

                    <div className="md:col-span-2  text-xl font-semibold">
                      <label htmlFor="contact">Contact</label>
                      <input
                        type="text"
                        name="contact"
                        id="contact"
                        className="h-10 border mt-1 rounded px-4 w-full text-gray-600 bg-gray-50 text-base"
                        value={newContact}
                        onChange={(e) => setContact(e.target.value)}
                      />
                    </div>
                    <p className="text-gray-500 text-center text-lg mb-2"></p>

                    <div className="md:col-span-2  text-xl font-semibold">
                      <label htmlFor="visitedDate">Date</label>
                      <input
                        type="date"
                        name="visitedDate"
                        id="visitedDate"
                        className="h-10 border mt-1 rounded px-4 w-full text-gray-600  bg-gray-50 text-base"
                        value={newVisitedDate}
                        onChange={(e) => setVisitedDate(e.target.value)}
                      />
                    </div>
                    <p className="text-gray-500 text-center text-lg mb-2"></p>

                    <div className="md:col-span-2  text-xl font-semibold">
                      <label htmlFor="description">Description</label>
                      <textarea
                        type="text"
                        name="description"
                        id="description"
                        className="h-10 border text-gray-600 mt-1 rounded px-4 w-full bg-gray-50 text-base"
                        value={newDescription}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <p className="text-gray-500 text-center text-lg mb-2"></p>
                    <div className="md:col-span-2 text-xl font-semibold">
                      <label htmlFor="placeType">Place Type</label>
                      <p className="mb-3"></p>
                      <select
                        name="placeType"
                        value={newPlaceType}
                        required
                        id="placeType"
                        onChange={(e) => {
                          setPlaceType(e.target.value);
                        }}
                        class="border py-2 px-3 text-grey-800 w-full text-gray-600 rounded-xl text-base"
                      >
                        <option selected disabled hidden>
                          Choose Type
                        </option>
                        <option value="Natural Attractions">
                          Natural Attractions
                        </option>
                        <option value="Cultural and Historical Sites">
                          {" "}
                          Cultural and Historical Sites
                        </option>
                        <option value="Adventure and Outdoor Activities">
                          {" "}
                          Adventure and Outdoor Activities
                        </option>
                        <option value="Wildlife and Safari Tours">
                          {" "}
                          Wildlife and Safari Tours
                        </option>
                        <option value="Culinary and Food Tourism">
                          {" "}
                          Culinary and Food Tourism
                        </option>
                      </select>
                    </div>
                    <p className="text-gray-500 text-center text-lg mb-2"></p>

                    <div className="md:col-span-2  text-xl font-semibold">
                      <label htmlFor="image">Image</label>
                      <input
                        type="file"
                        name="image"
                        id="image"
                        onChange={convertToBase64}
                        className="h-10 mt-1 w-full bg-gray-50 text-base"
                        accept="image/*"
                      />
                      {newImage && (
                        <img
                          alt="preview"
                          className="mt-2 max-h-20"
                          src={newImage}
                        />
                      )}
                    </div>

                    <div className="md:col-span-2 text-right">
                      <div className="inline-flex items-end">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={UpdateData}
                        >
                          Update Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdatePlace