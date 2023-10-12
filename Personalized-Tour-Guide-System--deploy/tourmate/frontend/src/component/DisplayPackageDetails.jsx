import React, { useState, useEffect } from "react";
import axios from "axios";

function DisplayPackageDetails() {
  const [favoritePlaces, setFavoritePlaces] = useState([]);

  useEffect(() => {
    async function fetchUserPackage() {
      try {
        const response = await axios.get(
          `http://localhost:8080/package/getPackage/user123` 
        );
        console.log(response);
        if (response.data.package) {
          setFavoritePlaces(response.data.package.selectedPlaces);
        }
      } catch (error) {
        console.error("Error fetching user's package:", error);
      }
    }

    fetchUserPackage();
  }, []);

  return (
    <div>
      <h2>User Profile</h2>
      <h3>My Package</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favoritePlaces.map((place, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden transition duration-300 transform hover:-translate-y-1 hover:shadow-xl relative"
          >
            <a href="#!">
              <img
                src={place.image}
                alt={place.placeName2}
                className="w-full h-40 object-cover"
              />
            </a>
            <div className="p-4">
              <h5 className="text-xl font-semibold mb-2 text-gray-800">
                {place.placeName2}
              </h5>
              <p className="text-sm text-gray-500">
                Location: {place.location}
              </p>
             
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DisplayPackageDetails;
