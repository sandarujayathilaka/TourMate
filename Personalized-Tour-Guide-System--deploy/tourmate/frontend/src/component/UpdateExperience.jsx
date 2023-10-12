import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CameraIcon } from "@heroicons/react/outline";

function UpdateExperience() {
    const { id } = useParams();
    const [experience, setExperience] = useState({
      _id: "",
      topic: "",
      userName: "",
      location: "",
      image: "",
      description: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);
  
    useEffect(() => {
      axios
        .get(`http://localhost:8080/exp/${id}`)
        .then((res) => {
          setExperience(res.data.experience);
        })
        .catch((err) => console.error("Error fetching experience:", err));
    }, [id]);
  
    async function updateExperience(experienceData) {
      try {
        const response = await axios.put(
          `http://localhost:8080/exp/${id}`,
          experienceData
        );
        console.log("Experience Updated:", response.data);
        setIsEditMode(false); 
      } catch (error) {
        console.error("Error updating experience:", error);
      }
    }
  
    function convertToBase64(e) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setExperience({ ...experience, image: reader.result });
      };
      reader.onerror = (error) => {
        console.log("Error:", error);
      };
    }
  
    const { _id, topic, userName, location, image, description } = experience;
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateExperience(experience);
          }}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                {isEditMode ? "Editing Experience" : "Viewing Experience"}
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {isEditMode
                  ? "Modify the information about this experience."
                  : "Viewing existing experience details."}
              </p>


              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="id"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Experience ID
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        value={_id}
                        readOnly={!isEditMode}
                        name="id"
                        id="id"
                        autoComplete="off"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="ID"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Topic
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) =>
                          isEditMode &&
                          setExperience({ ...experience, topic: e.target.value })
                        }
                        name="topic"
                        id="topic"
                        autoComplete="topic"
                        readOnly={!isEditMode}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Topic"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Username
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) =>
                          isEditMode &&
                          setExperience({
                            ...experience,
                            userName: e.target.value,
                          })
                        }
                        name="username"
                        id="username"
                        autoComplete="username"
                        readOnly={!isEditMode}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Username"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Location
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        value={location}
                        onChange={(e) =>
                          isEditMode &&
                          setExperience({
                            ...experience,
                            location: e.target.value,
                          })
                        }
                        name="location"
                        id="location"
                        autoComplete="location"
                        readOnly={!isEditMode}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Location"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Your Thoughts
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) =>
                        isEditMode &&
                        setExperience({
                          ...experience,
                          description: e.target.value,
                        })
                      }
                      name="description"
                      rows={10}
                      readOnly={!isEditMode}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Write a few sentences about your experiences.
                  </p>
                </div>

                <div className="col-span-full">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <CameraIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      {isEditMode && (
                        <>
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              onChange={convertToBase64}
                              required
                              className="sr-only"
                            />
                          </label>
                          {image && (
                            <img
                              alt="experience"
                              width={100}
                              height={100}
                              src={image}
                              className="mt-2"
                            />
                          )}
                        </>
                      )}
                      {image && (
                        <img
                          alt="experience"
                          width={100}
                          height={100}
                          src={image}
                          className="mt-2"
                        />
                      )}
                    </div>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              {!isEditMode && (
                <button
                  type="button"
                  onClick={() => setIsEditMode(true)}
                  className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </button>
              )}
              <button
                type="submit"
                className={`rounded-md ${
                  isEditMode
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-300 cursor-not-allowed"
                } px-3 py-2 text-sm font-semibold text-white shadow-sm focus:ring focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-gray-100`}
                disabled={!isEditMode}
              >
                {isEditMode ? "Save" : "Cannot Edit"}
              </button>
            </div>
          </div>
        </div>
        </form>
      </div>
    </div>

  );
}

export default UpdateExperience;