import axios from "axios";
import React, { useEffect, useState } from "react";
import slide from "../../assert/slide6.jpg";
import { Link } from "react-router-dom";

function DisplayAllHidden() {
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFavoritePlaces() {
      setIsLoading(true); // Set loading state to true
      try {
        const response = await axios.get(
          "http://localhost:8080/favplace/gethidden"
        );
        setFavoritePlaces(response.data.place);
      } catch (error) {
        console.error("Error fetching favorite places:", error);
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    }

    fetchFavoritePlaces();
  }, []);

  const handleTextSearch = (e) => {
    const searchTerm = e.currentTarget.value;
    axios.get(`http://localhost:8080/favplace/gethidden`).then((res) => {
      if (res.data.place) {
        filterContent(res.data.place, searchTerm);
      }
    });
  };

  function filterContent(place, searchTerm) {
    const result = place.filter((r) =>
      r.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFavoritePlaces(result);
  }

  const openPlaceDetails = (place) => {
    setSelectedPlace(place);
  };

  const closePlaceDetails = () => {
    setSelectedPlace(null);
  };

  return (
    <div className="pb-10">
      <div className="relative">
        <img
          src={slide}
          className="w-full h-96 object-cover custom-image"
          style={{
            borderBottomLeftRadius: "90px",

            borderBottomRightRadius: "90px",
          }}
        />
        <p class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-black text-6xl text-center font-bold bg-opacity-50 px-4 py-2 ">
          Explore the Unseen, Embrace the Unknown
        </p>

        <form>
          <label
            for="default-search"
            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div class=" relative ml-[36%] mt-[-10%] z-30">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              onChange={handleTextSearch}
              id="default-search"
              className="block w-1/2 h-16 p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search the location"
              required
            />
          </div>
        </form>
      </div>
      {isLoading ? (
        <div className="text-center flex justify-center items-center mt-36 mb-20">
          <div role="status">
            <svg
              aria-hidden="true"
              class="w-12 h-12 mr-2  text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-36 m-8">
          {favoritePlaces.length === 0 ? (
            <div className="bg-red-600">
              <h1 className="text-center text-zinc-50">No Records Found</h1>
            </div>
          ) : (
            favoritePlaces.map((place, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden transition duration-300 transform hover:-translate-y-1 hover:shadow-xl relative"
              >
                <Link onClick={() => openPlaceDetails(place)}>
                  <img
                    src={place.image}
                    alt={place.placeName}
                    className="w-full h-40 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h5 className="text-3xl font-semibold mb-2 text-gray-800">
                    {place.placeName}
                  </h5>
                </div>
              </div>
            ))
          )}
          {selectedPlace && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
              <div className="bg-white p-8 rounded-lg max-w-screen-sm">
                <img
                  src={selectedPlace.image}
                  alt={selectedPlace.placeName}
                  className="w-full h-40 object-cover"
                />
                <h2 className="text-3xl font-semibold mb-2 text-gray-800">
                  {selectedPlace.placeName}
                </h2>
                <span></span>
                <p className="text-lg font-semibold text-blue-950">
                  Location:
                  <span className="ml-3 text-lg text-sky-700">
                    {selectedPlace.location}
                  </span>
                </p>
                <span></span>
                <p className="text-lg font-semibold text-blue-950">
                  Contact:{" "}
                  <span className="ml-3 text-lg text-sky-700">
                    {selectedPlace.contact}
                  </span>
                </p>
                <span></span>
                <span></span>
                <p className="text-lg font-semibold text-blue-950">
                  Category:{" "}
                  <span className=" ml-3 text-lg text-sky-700">
                    {selectedPlace.category}
                  </span>
                </p>
                <span></span>
                <p className="text-lg font-semibold text-blue-950">
                  Description:{" "}
                </p>
                <br></br>
                <textarea className="w-96 h-40 text-lg" disabled>
                  {selectedPlace.description}
                </textarea>

                <div className="mt-4 flex justify-center">
                  {" "}
                  {/* Center the button */}
                  <button
                    className="px-4 py-2 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    onClick={closePlaceDetails}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DisplayAllHidden;
