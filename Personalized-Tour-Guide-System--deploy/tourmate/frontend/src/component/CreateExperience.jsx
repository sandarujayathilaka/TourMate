import React, { useState } from "react";
import axios from "axios";
import { UserCircleIcon, CameraIcon } from "@heroicons/react/outline";

function CreateExperience() {
    const [topic, setTopic] = useState("");
    const [userName, setUserName] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");

  
    async function addExperience(experience) {
        experience.preventDefault();
  
      const newExperience = {
        topic,
        userName,
        location,
        image,
        description
      };
  
      try {
        const response = await axios.post(
          "http://localhost:8080/exp",
          newExperience,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        console.log("Experience Shared:", response.data);
  
          setTopic("");
          setUserName("");
          setLocation("");
          setImage("");
          setDescription("");
  
      } catch (error) {
        console.error("Error sharing experience:", error);
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
  
  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl">
        <form
          onSubmit={addExperience}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
       
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                    Sharing Experiences
                    </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                This information will be displayed publicly, so be careful what
                you share.
              </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="topic" className="block text-sm font-medium leading-6 text-gray-900">
                Topic
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    name="topic"
                    id="topic"
                    autoComplete="topic"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="topic" 
                    required
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="janesmith"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                Location
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    name="location"
                    id="location"
                    autoComplete="location"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                   placeholder="kandy" 
                    required
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Your Thoughts
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  name="description"
                  rows={10}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                  required
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about your experiences.</p>
            </div>

        

            <div className="col-span-full">
              <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                Photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <CameraIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
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
                      className="sr-only"/>
                      {image && <img alt="pet" width={100} height={100} src={image} />} 
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rest  */}

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Share
          </button>
        </div>
      </div>
    </form>
</div>
</div>
  );
}

export default CreateExperience;
