import React, { useState, useEffect } from "react";

import axios from "axios";

import jsPDF from "jspdf";

import "jspdf-autotable";

import cvr from '../assert/cvr.jpg';

import { Link } from "react-router-dom";

import useAuth from '../hooks/useAuth';
 

 

 

 

export default function Experience() {
  const { auth } = useAuth();
  const {user} = auth;
  const [experiences, setExperience] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [userLocation, setUserLocation] = useState(""); // User-entered location

  const [userEmail, setUserEmail] = useState(""); // Define userEmail state

  const [showEmailPrompt, setShowEmailPrompt] = useState(false); // Define showEmailPrompt state

 

 

  useEffect(() => {
    const {  accessToken } = auth;
        
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    };
    axios

      .get("http://localhost:8080/exp",config)

      .then((res) => {

        setExperience(res.data);

      })

      .catch((err) => alert(err));

  }, []);

 

  const handleSearch = (e) => {

    const searchTerm = e.currentTarget.value;

    axios.get(`http://localhost:8080/exp`).then((res) => {

      if (res.data) {

        filterContent(res.data, searchTerm);

      }

    });

  };

 

  function filterContent(place, searchTerm) {

    const result = place.filter((r) =>

      r.location.toLowerCase().includes(searchTerm.toLowerCase())

    );

    setExperience(result);

  }

 

  const resetSearch = () => {

    setSearchTerm("");
    const {  accessToken } = auth;
        
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    };

    axios

      .get("http://localhost:8080/exp",config)

      .then((res) => {

        setExperience(res.data);

      })

      .catch((err) => alert(err));

  };

 

 

 

 

  // Function to handle user email input

  const handleEmailInput = (email) => {

    setUserEmail(email);

    setShowEmailPrompt(false); // Hide the email prompt

  };

 

 

  return (

<div className="flex scroll-smooth">

      <div className="bg-[#ffffff] flex-[85%]">

      <div className="relative">

          <img

            src={cvr}

            className="w-full h-64 object-cover custom-image"

            alt="Cover Image"

            style={{

              borderBottomLeftRadius: "90px",

              borderBottomRightRadius: "90px",

            }}

          />
<p class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-black text-6xl text-center font-bold bg-opacity-50 px-4 py-2 ">

Explore the Unseen, Embrace the Unknown

</p>
          <div className=" absolute top-3 right-3 transform -translate-x-1/2 z-10">

           
 

            

          </div>

        </div>
        

        <div class="relative ml-[36%] mt-[-10%] z-30">
<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
<svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
</svg>
</div>
<input type="search" onChange={handleSearch} id="default-search" class="block w-1/2 h-16 p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transform hover:scale-105 transition-transform duration-300 shadow-lg mt-40" placeholder="Search the location" required />
</div>

        <main className="py-6 px-4 sm:p-6 md:py-10 md:px-8">

        <div className="max-w-screen-2xl mx-auto px-4"> {/* Adjusted max-w class */}

          <div className="grid grid-cols-3 gap-8">

 

            {experiences.map((experience, index) => (

              <div

                key={index}

               // className="w-1/2 p-4" // Each grid item takes 50% width

                className="bg-white shadow-md rounded-lg overflow-hidden transition duration-300 transform hover:-translate-y-1 hover:shadow-xl relative mb-4"

              >

                <img

                  src={experience.image}

                  alt={experience.topic}

                  className="w-full object-cover"

                />

                <div className="p-4">

                  <h1 className="mt-1 text-lg font-semibold text-gray-800">

                    {experience.topic}

                  </h1>

                  <p className="text-sm leading-4 text-gray-600">

                    {experience.userName}

                  </p>

                  <div className="grid gap-4 mt-4">

                    <dl className="text-xs font-medium flex items-center">

                     

                      <dt className="sr-only">Location</dt>

                      <dd className="flex items-center">

                        <svg

                          width="2"

                          height="2"

                          aria-hidden="true"

                          fill="currentColor"

                          className=" text-gray-300"

                        >

                          <circle cx="1" cy="1" r="1" />

                        </svg>

                        <svg

                          width="24"

                          height="24"

                          fill="none"

                          stroke="currentColor"

                          strokeWidth="2"

                          strokeLinecap="round"

                          strokeLinejoin="round"

                          className="mr-1 text-gray-400"

                          aria-hidden="true"

                        >

                          <path

                            d="M18 11.034C18 14.897 12 19 12 19s-6-4.103-6-7.966C6 7.655 8.819 5 12 5s6 2.655 6 6.034Z"

                            strokeWidth="2"

                            strokeLinecap="round"

                            strokeLinejoin="round"

                          />

                          <path

                            d="M14 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"

                            strokeWidth="2"

                            strokeLinecap="round"

                            strokeLinejoin="round"

                          />

                        </svg>

                        {experience.location}

                      </dd>

                    </dl>

                   

                  </div>

                  <p className="mt-4  text-sm leading-6 text-gray-700">

                    {experience.description}

                  </p>

                </div>

              </div>

            ))}

            </div>

          </div>

        </main>

      </div>

    </div>

  );

}

 

 

function onDelete(id) {

  if (!id) {

    console.error("Invalid id:", id);

    return;

  }

 

  axios

    .delete(`http://localhost:8080/exp/${id}`)

    .then((res) => {

      alert("Deleted experience record");

      window.location.reload();  

    })

    .catch((err) => {

      console.error("Error deleting:", err);

      alert("Error deleting experience record");

    });

}