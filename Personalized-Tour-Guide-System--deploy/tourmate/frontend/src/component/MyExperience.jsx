import React, { useEffect, useState } from "react";

import axios from "axios";
import useAuth from '../hooks/useAuth';
import { useParams, Link } from "react-router-dom"; // Import useParams and Link

 

export default function MyExperience() {
  const { auth } = useAuth();
  const { user } = auth;
 // Get the user parameter from the URL

  const [experiences, setExperiences] = useState([]);

 

  useEffect(() => {

    // Fetch experiences based on the provided user

    async function fetchExperiences() {

      try {

        if (user) {

          const response = await axios.get(`http://localhost:8080/exp/myexperiences/${user}`);

          setExperiences(response.data);

        }

      } catch (error) {

        console.error("Error fetching experiences by user:", error);

      }

    }

 

    fetchExperiences();

  }, [user]);

 

  const onDelete = (id) => {

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

  };

 

  return (

    <div className="my-experiences">

      <h2>My Experiences</h2>

      <ul>

        {experiences.map((experience, index) => (

          <div

            key={index}

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

                <div className="mt-4">

                  <button

                    className="bg-[#1f1758] hover:bg-[#62d9e0] text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg mr-2"

                    onClick={() => onDelete(experience._id)}

                  >

                    Delete

                  </button>

                  <Link

                    to={`/updateExp/${experience._id}`}

                    className="bg-[#1f1758] hover:bg-[#62d9e0] text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg"

                  >

                    Update

                  </Link>

                </div>

              </div>

              <p className="mt-4 text-sm leading-6 text-gray-700">

                {experience.description}

              </p>

            </div>

          </div>

        ))}

      </ul>

      <button onClick={() => (window.location.href = "/addExp")}>Add New Experience</button>

    </div>

  );

}

 