import React, { useState, useEffect } from "react";

import axios from "axios";

import jsPDF from "jspdf";

import "jspdf-autotable";

import cvr from '../assert/cvr.jpg';

import { Link } from "react-router-dom";

import useAuth from '../hooks/useAuth';
 

 

 

 

export default function Experience() {
  const { auth } = useAuth();
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

 

  const handleSearch = () => {

    const filteredExperiences = experiences.filter((experience) =>

      experience.topic.toLowerCase().includes(searchTerm.toLowerCase())

    );

    setExperience(filteredExperiences);

  };

 

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

 

  const generateReport = () => {

    const filteredExperiences = experiences.filter((experience) =>

      experience.location.toLowerCase() === userLocation.toLowerCase()

    );

 

    const title = "Report";

    const doc = new jsPDF();

    const today = new Date();

    const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

 

    // Define a margin and padding for content

    const margin = 20;

    const padding = 10;

 

    // Set document font and color

    doc.setFont("helvetica");

    doc.setTextColor("#000000");

 

    // Create a magazine-style layout

    const pageWidth = doc.internal.pageSize.width;

    const pageHeight = doc.internal.pageSize.height;

    const contentWidth = pageWidth - 2 * margin;

 

    // Add a title

    doc.setFontSize(24);

    doc.text(title, margin, margin);

 

    // Add date

    doc.setFontSize(12);

    doc.setTextColor("#999999");

    doc.text(`Generated on ${date}`, margin, margin + 10);

 

    // Add logo and company details

    doc.addImage("path_to_your_image.jpg", "JPEG", margin, margin + 20, 40, 40);

    doc.setFontSize(16);

    doc.setFont("helvetica", "bold");

    doc.setTextColor("#000000");

    doc.text("TourMate", margin + 50, margin + 30);

    doc.setFont("helvetica", "normal");

    doc.setFontSize(10);

    doc.setTextColor("#999999");

    doc.text("Tel: +94 11 234 5678", margin + 50, margin + 40);

    doc.text("Address: No 221/B, Peradeniya Road, Kandy", margin + 50, margin + 50);

 

    // Add a magazine-style content layout

    let currentY = margin + 80;

 

    filteredExperiences.forEach((experience) => {

      // Add the topic

      doc.setFontSize(18);

      doc.setTextColor("#000000");

      doc.text(experience.topic, margin, currentY);

 

      // Add the author

      doc.setFontSize(12);

      doc.setTextColor("#999999");

      doc.text(`Author: ${experience.userName}`, margin, currentY + 10);

 

      // Add the location

      doc.setFontSize(12);

      doc.setTextColor("#999999");

      doc.text(`Location: ${experience.location}`, margin, currentY + 20);

 

      // Add the image

      doc.addImage(experience.image, margin, currentY + 30, 60, 60);

 

      // Add the description

      doc.setFontSize(12);

      doc.setTextColor("#000000");

 

      // Set the font style to italic

      doc.setFont(undefined, 'italic');

 

      const newMargin = margin - 10;

      const descriptionLines = doc.splitTextToSize(experience.description, contentWidth - padding * 2);

      doc.text(descriptionLines, newMargin + padding, currentY + 100);

 

      // Set the font style back to normal (if needed for subsequent text)

      doc.setFont(undefined, 'normal');

 

      currentY += descriptionLines.length * 10;

 

      // Move to the next page if necessary

      if (currentY + 200 > pageHeight - margin) {

        doc.addPage();

        currentY = margin;

      } else {

        currentY += 200;

      }

    });

 

    doc.save("Exp Magazine Report.pdf");

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

          <div className=" absolute top-3 right-3 transform -translate-x-1/2 z-10">

            <div className=" flex p-5">

              <Link

                to="/addExp"

                className=" bg-[rgb(57,195,205)] hover:bg-[#16108d] px-[15px] py-[8px] rounded-[120px] font-bold text-white text-[12px] block w-[100px] text-center mr-2"

              >

                +ADD

              </Link>

            </div>

            <div className=" flex p-5">

              {showEmailPrompt ? ( // Display EmailPrompt if showEmailPrompt is true

                <div></div>

              ) : (

                <button

                  className="bg-[#39c3cd] hover:bg-[#16108d] px-[15px] py-[8px] rounded-[120px] font-bold text-white text-[12px] block w-[120px] text-center ml-2"

                  onClick={() => setShowEmailPrompt(true)}

                >

                  My Experience

                </button>

              )}

            </div>

 

            <div className="flex scroll-smooth">

              <input

                type="text"

                placeholder="Enter Location"

                value={userLocation}

                onChange={(e) => setUserLocation(e.target.value)}

              />

              <button

                className="bg-[#39c3cd] hover-bg-[#16108d] px-[15px] py-[8px] rounded-[120px] font-bold text-white text-[12px] block w-[100px] text-center mr-2"

                onClick={generateReport}

              >

                Get Report

              </button>

            </div>

          </div>

        </div>

        <div className="flex justify-center">

          <div className="flex h-10 w-200 mt-3">

            <input

              type="text"

              className="rounded-3xl py-2.5 px-5 w-[40vh] text-sm text-black-900 bg-[#E4EBF7] border-0 border-b-2 border-gray-300 appearance-non focus:outline-none focus:ring-0 focus:border-[#FF9F00] mr-2"

              placeholder="Search by Location"

              value={searchTerm}

              onChange={(e) => {

                setSearchTerm(e.target.value);

              }}

            />

            <button

              className="bg-[#39c3cd] hover:bg-[#16108d] px-[15px] py-[8px] rounded-[120px] font-bold text-white text-[12px]"

              onClick={handleSearch}

            >

              Search

            </button>

            {searchTerm && (

              <button

                className="bg-[#39c3cd] hover:bg-[#16108d] px-[15px] py-[8px] rounded-[120px] font-bold text-white text-[12px] ml-2"

                onClick={resetSearch}

              >

                Reset

              </button>

            )}

          </div>

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