import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assert/flowlogo.png";
import hiddenlogo from "../../assert/hiddensearch.png";
import favlogo from "../../assert/mapfav.png";
import hotel from "../../assert/hotel.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";

function Analytics() {
  const [Places, setPlaces] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [placeType, setPlaceType] = useState({});
  const [placeCount, setPlaceCount] = useState({});
   const { auth } = useAuth();
   const { user } = auth;
  const userid = user;

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    if (startDate || endDate) {
      fetchPlaces();
    }
  }, [startDate, endDate]);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/favplace/getallvisitedplaces/${userid}`
      );
      const places = response.data.places;

      // Sort the places array in ascending order based on the "visitedDate" field
      places.sort((a, b) => new Date(a.visitedDate) - new Date(b.visitedDate));

      setPlaces(places);
    } catch (error) {
      console.error("Error fetching favorite places:", error);
      setPlaces([]);
    }
  };

  useEffect(() => {
    async function fetchPlaceCount() {
      try {
        const response = await axios.get(
          `http://localhost:8080/favplace/getplacecount/${userid}`
        );

        setPlaceCount(response.data);
      } catch (error) {
        console.error("Error fetching favorite places:", error);
      }
    }

    fetchPlaceCount();
  }, []);

  useEffect(() => {
    async function fetchPlaceType() {
      try {
        const response = await axios.get(
          `http://localhost:8080/favplace/getplacetypecount/${userid}`
        );

        setPlaceType(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching most visited Place Type:", error);
      }
    }

    fetchPlaceType();
  }, []);

  const filterPlacesByDate = () => {
    if (startDate && endDate) {
      const filteredPlaces = Places.filter((place) => {
        const visitedDate = new Date(place.visitedDate);
        const start = new Date(startDate);
        const end = new Date(endDate);

        return visitedDate >= start && visitedDate <= end;
      });

      setPlaces(filteredPlaces);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF("landscape", "px", "a4", false);
    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    const title = "Travel Details Report";

    // Set document font and color
    doc.setFont("helvetica");
    doc.setTextColor("#000000");

    // Add title and date
    doc.setFontSize(20);
    doc.text(title, 20, 30);
    doc.setFontSize(12);
    doc.setTextColor("#999999");
    doc.text(`Generated on ${date}`, 20, 40);

    doc.setFontSize(10);
    doc.setTextColor("#121212");
    doc.text(40, 140, "Start Date :  ");
    doc.text(90, 140, startDate);

      doc.setFontSize(10);
      doc.setTextColor("#121212");
      doc.text(40, 150, "End Date :  ");
      doc.text(90, 150, endDate);

    doc.addImage(logo, "JPG", 20, 60, 40, 40);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#000000");
    doc.text("TourMate", 70, 70);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#999999");
    doc.text("Tel: +94 11 234 5678", 70, 80);
    doc.text("Email: tourmatereport@tourmate.com", 70, 90);

    doc.autoTable({
      startY: 160,
      head: [["Place", "Location", "Category", "Place Type", "Visited Date"]],
      body: Places.map((place) => [
        place.placeName,
        place.location,
        place.category,
        place.placeType,
        place.visitedDate,
      ]),

      theme: "striped",
    });

    doc.save("TravelReport.pdf");

    toast.success("PDF Downloaded", {
      autoClose: 2000, // Display for 2 seconds
    });
  };

  return (
    <div className="mx-8 my-12 ">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-semibold text-gray-800 mb-16">
          {""}--- Exploration Insights ---
        </h1>
      </div>

      <div className="flex space-x-4 mb-4">
        <div className="w-1/3 p-4 bg-gray-100 shadow-md rounded flex items-center justify-center">
          <div className="flex items-center">
            <img className="w-16 mr-2" src={hiddenlogo} alt="Hidden Places" />
            <div>
              <p className="text-3xl font-semibold text-center text-gray-800">
                {placeCount.HiddenPlace ?? 0}
              </p>
              <p className="text-lg text-center text-gray-500">
                Found Hidden Spots
              </p>
            </div>
          </div>
        </div>

        <div className="w-1/3 p-4 bg-gray-100 shadow-md rounded flex items-center justify-center">
          <div className="flex items-center">
            <img className="w-16 mr-2" src={favlogo} alt="Hidden Places" />
            <div>
              <p className="text-3xl font-semibold text-center text-gray-800">
                {placeCount.FavouritePlace ?? 0}
              </p>
              <p className="text-lg text-center text-gray-500">
                Favourite Attractions
              </p>
            </div>
          </div>
        </div>

        <div className="w-1/3 p-4 bg-gray-100 shadow-md rounded flex items-center justify-center mt">
          <div className="flex items-center">
            <img className="w-28 mr-2" src={hotel} alt="Hidden Places" />
            <div>
              <p className="text-3xl font-semibold text-center text-gray-800">
                {placeCount.FavouriteHotel ?? 0}
              </p>
              <p className="text-lg text-center text-gray-500">
                Favourite Hotels
              </p>
            </div>
          </div>
        </div>

        <div className="w-1/3 p-4 bg-gray-100 shadow-md rounded">
          <p className="text-xl font-semibold text-center text-gray-800 mt-2">
            {placeType.mostCommonCategory ?? "0"}
          </p>
          <p className="text-lg text-center pt-2 text-gray-500">
            Most Visited Category
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-10 ">
        <div className="relative overflow-x-auto shadow-md rounded-lg p-4 w-1/2 bg-gray-100 ">
          <div className="mx-auto w-1/2">
            <div className="flex items-center justify-center space-x-4">
              <div>
                <label className="text-gray-700">Start Date</label>
                <input
                  type="date"
                  className="p-2 rounded border w-full"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-gray-700">End Date</label>
                <input
                  type="date"
                  className="p-2 rounded border w-full"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt mt-5 rounded w-full"
                  onClick={filterPlacesByDate}
                >
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {Places.length === 0 ? (
          <p className="text-center text-gray-600 font-medium text-lg">
            No Record Found
          </p>
        ) : (
          <table className="w-full table-fixed border-collapse mt-10 ">
            <thead className="text-sm font-semibold uppercase bg-sky-950 text-white">
              <tr>
                <th className="w-1/4 py-3 px-6 text-left">Place Name</th>
                <th className="w-1/4 py-3 px-6 text-left">Location</th>
                <th className="w-1/4 py-3 px-6 text-left">Category</th>
                <th className="w-1/4 py-3 px-6 text-left">Place Type</th>
                <th className="w-1/4 py-3 px-6 text-left">Visited Date</th>
              </tr>
            </thead>
            <tbody>
              {Places.map((place, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-200" : "bg-white"}
                >
                  <td className="w-1/4 py-3 px-6 text-left">
                    {place.placeName}
                  </td>
                  <td className="w-1/4 py-3 px-6 text-left">
                    {place.location}
                  </td>
                  <td className="w-1/4 py-3 px-6 text-left">
                    {place.category}
                  </td>
                  <td className="w-1/4 py-3 px-6 text-left">
                    {place.placeType}
                  </td>
                  <td className="w-1/4 py-3 px-6 text-left">
                    {place.visitedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <button
        onClick={generatePDF}
        className="bg-[#30475c]  hover:bg-[#084469] px-[15px] py-[8px] rounded-md mt-10 font-bold text-white text-[14px] block w-[150px] text-center mx-auto"
      >
        Download Report
      </button>
    </div>
  );
}

export default Analytics;
