import React, { useEffect, useState } from "react";
import bg from "../assert/bg.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { CgNotes } from 'react-icons/cg';
import useAuth from '../hooks/useAuth';

function Wishlist() {
  const { auth } = useAuth();
  const { user } = auth;
  const [placesData, setPlacesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [overLay, setOverLay] = useState(false);

  const [isEditing, setIsEditing] = useState(true); 
  const [editingNote, setEditingNote] = useState("");
  const [target, setTarget] = useState("");
  const [targetDetails, setTargetDetails] = useState({});

  useEffect(() => {
    const {  accessToken } = auth;
    console.log(accessToken);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    };
    const apiUrl = `http://localhost:8080/wishlist/getWishlist/${user}`;
    axios
      .get(apiUrl,config)
      .then((response) => {
        setPlacesData(response.data.wishlist);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const removeWishlist = (placeName) => {
    const deleteUrl = `http://localhost:8080/wishlist/deleteWishList/${placeName}`;

    axios
      .delete(deleteUrl)
      .then(() => {
        setPlacesData((prevData) =>
          prevData.filter((place) => place.placeName !== placeName)
        );
        toast.success(`Removed ${placeName} from wishlist.`);
      })
      .catch((error) => {
        console.error("Error removing package:", error);
        toast.error(`Error removing ${placeName} from wishlist.`);
      });
  };

  const handleDeleteClick = async (placeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this place?"
    );
    if (!confirmed) {
      return;
    }

    try {
      const {  accessToken } = auth;
        console.log(accessToken);
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        };
      const response = await axios.delete(
        `http://localhost:8080/wishlist/deletePlace/${placeId}`,config
      );
      console.log("Place deleted:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

  const handleVist = (place) => {
    const { lat, long } = place;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`;
    window.open(url, '_blank');
  };

  const handleVideo = (videoName) => {
    const encodedVideoName = encodeURIComponent(videoName);
    const url = `https://www.youtube.com/results?search_query=${encodedVideoName}`;
    window.open(url, '_blank');
  };

  // Filter places based on the search query
  const filteredPlaces = placesData.filter((place) =>
    place.placeName.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const getNote = async (placeName) => {
    try {
      const {  accessToken } = auth;
      console.log(accessToken);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      };
      
      const response = await axios.get(`http://localhost:8080/wishlist/getNote/${placeName}`,config);
      getNote(response.data.note);
      setEditingNote(response.data.note);
    } catch (error) {
      console.error("Error fetching note:", error);
    }
  };





  const handleNoteUpdate = async () => {
    // Call the getNote function here
    await getNote();
    
    try {
      const {  accessToken } = auth;
        console.log(accessToken);
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        };
      await axios.put(`http://localhost:8080/wishlist/updateWishList/${target}`,config, { note: editingNote });
      setIsEditing(false);

      toast.success("Note updated", {
        position: toast.POSITION.TOP_RIGHT,
      });

      setTimeout(() => {
        window.location.href = "/wishList";
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };
  


  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col items-center">
        <h1
          className="text-6xl font-bold mb-4 mt-4"
          style={{
            fontFamily: 'Brush Script MT, cursive',
          }}
        >
          My Trips
        </h1>

        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search by Your Trip Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 mb-4"
          />
        </div>

        <div className="main">
          <div>

            <div className="overflow-y-auto overflow-hidden h-[700px]" >
              {Array.from(new Set(filteredPlaces.map((place) => place.placeName)))
                .map((placeName) => (
                  <div key={placeName}>
                    <div>
                      <h2 className="text-2xl font-bold mb-4 ml-5">{placeName}</h2>

                      <div className="flex">
                        <button
                          type="button"
                          className="ml-5 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2"
                          onClick={() => removeWishlist(placeName)}
                        >
                          Remove
                        </button>
                        <Link to="/searchPlaces">
                          <button
                            type="button"
                            className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                          >
                            + Add New Place
                          </button>

                        </Link>


                        <Link to={`/updateNote/${placeName}`}>
                        <button type="button" onClick={() => {setOverLay(true); setTarget(placeName)}}>
                          <CgNotes style={{ fontSize: '2.3rem' }} title="Note" />
                          {/* Note */}
                        </button>
                        </Link>




                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {filteredPlaces
                        .filter((place) => place.placeName === placeName)
                        .map((place) => (
                          <div
                            key={place._id}
                            className="card m-2 bg-white shadow-md rounded-lg p-4 dark:bg-gray-800 dark:border-gray-700 relative"
                            style={{
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                              border: '1px solid gray',
                            }}
                          >
                            <div className="top-shadow"></div>
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                              {place.placeName2}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">{place.description}</p>
                            <div className="flex justify-start mt-2">
                              <button
                                type="button"
                                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2"
                                onClick={() => handleDeleteClick(place._id)}
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2"
                                onClick={() => handleVist(place)}
                              >
                                visit
                              </button>

                              <button
                                type="button"
                                className="text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2"
                                onClick={() => handleVideo(place.placeName2)}
                              >
                                Learn more
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                    <hr
                      className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-690"
                      style={{ marginLeft: '35px', marginRight: '35px' }}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {overLay && (
        <div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div class="w-full h-full bg-black p-8 flex items-center justify-center">
      
          <form class="flex flex-col items-center">
            <div class="mb-6">
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Personal Note</label>
              <textarea
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[500px] p-2.5 h-40 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={editingNote}
                onChange={(e) => setEditingNote(e.target.value)}
              ></textarea>
            </div>
            <div class="flex justify-between items-center">
              <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm flex-grow px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleNoteUpdate}>Submit</button>
              <button type="button" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm flex-grow px-5 py-2.5 text-center ml-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"  
              onClick={() => setOverLay(false)}>Cancel</button>
            </div>
          </form>
      
        </div>
      </div>
      


      )
      }



    </div>



  );
}

export default Wishlist;
