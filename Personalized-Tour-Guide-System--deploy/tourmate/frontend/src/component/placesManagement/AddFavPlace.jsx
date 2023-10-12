import React, { useEffect, useState } from "react";
import slide from "../../assert/back1.jpg";
import slide1 from "../../assert/addback.avif";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";

function AddFavPlace() {

 
  const [placeName, setPlaceName] = useState("");
  const [userId, setUserId] = useState("");
  const [category, setCategory] = useState("");
  const [visitedDate, setVisitedDate] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [placeType, setPlaceType] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const { auth } = useAuth();
   const { user } = auth;
   const userid = user;

  const initializeGeolocation = () => {
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

  async function addPlace(event) {
    event.preventDefault();

    if (description.length > 300) {
      toast.error("Description cannot exceed 200 characters");
      return; // Exit the function without adding data
    }

    if (!placeName) {
      toast.error("Place Name is required.");
      return;
    }

    if (!category) {
      toast.error("Category is required.");
      return;
    }

    if (!currentLocation && !location) {
      toast.error("Location is required.");
      return;
    }

    if (!visitedDate) {
      toast.error("Visited Date is required.");
      return;
    }

    if (!placeType) {
      toast.error("Place Type is required.");
      return;
    }

    if (!image || !isImageTypeValid(image)) {
      toast.error("Please select a valid image file (jpg, jpeg, or png).");
      return;
    }

    const newPlace = {
      placeName,
      userId: userid,
      category,
      visitedDate,
      location: currentLocation || location,
      contact,
      image,
      description,
      latitude,
      longitude,
      placeType,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/favplace/addfavplace",
        newPlace,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      console.log("Favorite place added:", response.data);

      setPlaceName("");
      setUserId("");
      setCategory("");
      setVisitedDate("");
      setLocation("");
      setContact("");
      setImage("");
      setDescription("");
      setLatitude("");
      setLongitude("");
      setPlaceType("");
      toast.success("Place SuccessFully Added", {
        autoClose: 2000, // Display for 3 seconds
      });
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.error) {
          toast.error(error.response.data.error);
        }
        if (error.response.data.exsisterror) {
          toast.error(error.response.data.exsisterror);
        } else {
          toast.error(error.response);
        }
      } else {
        toast.error("An error occurred while adding the place.");
      }
      console.log(error.response.data.error);
    }

    function isImageTypeValid(image) {
      return (
        image.startsWith("data:image/jpeg") ||
        image.startsWith("data:image/jpg") ||
        image.startsWith("data:image/png")
      );
    }
  }

  function convertToBase64(e) {
    const selectedFile = e.target.files[0];

    // Check if a file was selected
    if (!selectedFile) {
      return;
    }

    // Check if the selected file type is valid (jpg, jpeg, or png)
    if (
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/jpg" ||
      selectedFile.type === "image/png"
    ) {
      // File type is valid, proceed with converting to base64
      var reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.onerror = (error) => {
        console.log("Error:", error);
      };
    } else {
      // File type is not valid
      toast.error("Please select a valid image file (jpg, jpeg, or png).");
    }
  }

  const containerStyle = {
    backgroundImage: `url(${slide})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
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
              Capture Your Journey , Memorize Your Trip
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
                        value={placeName}
                        onChange={(e) => setPlaceName(e.target.value)}
                      />
                    </div>
                    <p className="text-gray-500 text-center text-lg mb-2"></p>

                    <div className="md:col-span-2 text-xl font-semibold">
                      <label htmlFor="category">Category</label>
                      <p className="mb-3"></p>
                      <select
                        name="category"
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
                          value={currentLocation || location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
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
                    <div className="md:col-span-2 text-xl font-semibold">
                      <label htmlFor="contact">Contact</label>
                      <input
                        type="text"
                        name="contact"
                        id="contact"
                        className="h-10 border mt-1 rounded px-4 w-full text-gray-600 bg-gray-50 text-base"
                        value={contact}
                        onChange={(e) => {
                          // Use a regular expression to validate input
                          const input = e.target.value;
                          const isValid = /^\+?\d*$/g.test(input); // Allows positive numbers with a + symbol or empty

                          if (isValid) {
                            setContact(input);
                          }
                        }}
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
                        value={visitedDate}
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
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <p className="text-gray-500 text-center text-lg mb-2"></p>

                    <div className="md:col-span-2 text-xl font-semibold">
                      <label htmlFor="placeType">Place Type</label>
                      <p className="mb-3"></p>
                      <select
                        name="placeType"
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
                        <option value=" Natural Attractions">
                          Natural Attractions
                        </option>
                        <option value=" Cultural and Historical Sites">
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
                      />
                      {image && (
                        <img
                          alt="preview"
                          className="mt-2 max-h-20"
                          src={image}
                        />
                      )}
                    </div>

                    <div className="md:col-span-2 text-right">
                      <div className="inline-flex items-end">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={addPlace}
                        >
                          Add Place
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

export default AddFavPlace;
