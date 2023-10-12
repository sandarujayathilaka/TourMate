import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import profile from "../assert/user.jpg"

export default function AllEvent() {
  const { auth } = useAuth();
  const { user } = auth;
  const [users, setUser] = useState([]);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [image, setImage] = useState(users.image ? users.image : profile);

  const [file, setFile] = useState(null);
  const [preImage, setPreImage] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dusername, setDUsername] = useState("");
  const [demail, setDEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const fileInputRef = useRef(null);
  console.log(user);

  useEffect(() => {
    async function getUser() {
      try {
        const {  accessToken } = auth;
        
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        };
        
        const res = await axios.get(
          `users/getUser/${user}`,config
        );
        console.log(res.data);
        setUsername(res.data.username);
        setEmail(res.data.email);
        setPreImage(res.data.image);
        setDEmail(res.data.email);
        setDUsername(res.data.username);
        setImage(res.data.image);
        setUser(res.data);
      } catch (err) {
        toast.error(err);
      }
    }

    getUser();
  }, []);


  const handleEditUsername = () => {
    setEditUsername(true);
  };

  const handleEditEmail = () => {
    setEditEmail(true);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setPassword("");
    setEditEmail(false);
    setEditUsername(false);
    setIsModalOpen(false);
    setUsername(dusername);
    setEmail(demail);
  };


  const updateUsername = async (e) => {
    e.preventDefault();
  
    try {
      const { accessToken } = auth;
  
      const response = await axios.put(
        `/users/updateUsername/${user}`,
        JSON.stringify({ username, password }),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        setEditUsername(false);
    setEditEmail(false);
        toast.success("Username updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      }
    } catch (err) {
      if (!err?.response) {
        toast.error('No Server Response');
      } else if (err.response?.status === 400) {
        toast.error('username required');
      }
      else if (err.response?.status === 402) {
        toast.error('No changes made to the profile.');
      }
      else if (err.response?.status === 406) {
        toast.error('Username is already used. Try new name.');
      }
     else if (err.response?.status === 409) {
        toast.error('Confirm password is not matched.');
      }
      else {
        toast.error('update Failed');
      }
    }
  };
 
  const updateUserEmail = async (e) => {
    e.preventDefault();
  
    try {
      const { accessToken } = auth;
  console.log("146",user);
      const response = await axios.put(
        `/users/updateUserEmail/${user}`,
        JSON.stringify({  email, password }),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        setEditUsername(false);
    setEditEmail(false);
        toast.success("Email updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      }
    } catch (err) {
      if (!err?.response) {
        toast.error('No Server Response');
      } else if (err.response?.status === 400) {
        toast.error('username required');
      }
      else if (err.response?.status === 402) {
        toast.error('No changes made to the profile.');
      }
      else if (err.response?.status === 418) {
        toast.error('Email is already used.Try another email.');
      }else if (err.response?.status === 409) {
        toast.error('Confirm password is not matched.');
      }
      else {
        toast.error('update Failed');
      }
    }
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleNotEdit = () => {
    setIsEditing(false);
  };

  const handleEditClick = async () => {
    try {
      const { accessToken } = auth;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // Check if a new image file has been selected
      if (file) {
        // Convert the file to a base64 string
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64Image = reader.result;

          // Send the base64 image string in the request body
          const res = await axios.put(
            `users/updateUserImage/${user}`,
            { image: base64Image },
            config
          );
          if (res.status === 200) {
            toast.success("Image updated successfully.");
            setImage(base64Image);
            setIsEditing(false); // Disable editing mode
            
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            toast.error("Failed to update image.");
          }
        };
        reader.onerror = (error) => {
          toast.error("Error reading file: ", error);
        };
      } else {
        toast.error("No image selected.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  };
  
  
  // Handle file input change and set the selected file in the state
  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      setFile(selectedFile);
      // Display the selected image for preview
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        setImage(reader.result);
      };
      setSelectedFileName(selectedFile);
    }
  };
  
  const handleRemoveClick = async () => {
    try {
      if(preImage === null){
        setImage(profile);
        setFile('');
        setSelectedFileName('');
        return;
      }
      if (users.image !== image) {
        // toast.error("Image is not added previously.");
        setImage(users.image);
        setFile('');
        setSelectedFileName('');
        return;
      }
      
      // else if(preImage === null && image !== null){
      //   setImage(profile);
      //   return;
      // }
      else{
      // Send a request to remove the image from the database
      const { accessToken } = auth;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const res = await axios.delete(
        `users/removeUserImage/${user}`,
        config
      );
      
      if (res.status === 200) {
        // Image successfully removed from the database
        
        setImage(profile); // Set the default image
        
        toast.success("Image removed successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        
      } else {
        toast.error("Failed to remove image.");
      }
    }
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  };

  


  const onDelete = async () => {
    const { accessToken } = auth;
  console.log(password);
    try {
      await axios.delete(
        `/users/deleteUser/${user}`,
        { data: { password } },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log(password);
      toast.success("Account Deleted!!");
      setIsDeleteModalOpen(false);
      setPassword("");
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 5000);
    } catch (err) {
      if (!err?.response) {
        toast.error('No Server Response');
      } else if (err.response?.status === 400) {
        toast.error('username required');
      }
      else if (err.response?.status === 402) {
        toast.error('username not found');
      }
      else if (err.response?.status === 406) {
        toast.error('Confirm password is not matched.');
      }
      else if (err.response?.status === 500) {
        toast.error('An error occurred while deleting the account.');
      }else {
        toast.error('delete Failed');
      }
    }
  };
  
  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setPassword("");
    setIsDeleteModalOpen(false);
  };

  const handleDelete = () => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure, you want to delete this account?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            openDeleteModal();
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <>
      
        <div className="flex justify-center items-center h-full mt-20">
          <div className="bg-slate-400 rounded-lg shadow-2xl p-8 m-4 w-3/4">
            
  
  <div>
    <h1 className="text-2xl text-center font-bold mb-4">My Profile</h1>
            <div className="flex justify-center">
        <div
          className="relative w-48 h-48 overflow-hidden rounded-full"
          onMouseEnter={() => setIsEdit(true)}
          onMouseLeave={() => setIsEdit(false)}
        >
          
              {isEdit && (
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-40">
                {/* First row */}
                <div className="mb-2">
                  <input
                    type="file"
                    accept="image/*" // Allow only image files
                    onChange={handleImageUpload}
                    ref={fileInputRef} // Create a reference to the input
                    className="w-auto text-white px-2 py-1"
                    id="file-input"
                   style={{ display: "none" }}
                 />
                 <label htmlFor="file-input" className=" text-white cursor-pointer">
        Choose image
      </label>
      {selectedFileName && <p className=" text-white">Selected image: {selectedFileName.name}</p>}
                </div>
              
                {/* Second row */}
                <div className="flex">
                  <button
                    onClick={handleEditClick}
                    className="text-white mx-2 px-2"
                  >
                    Save
                  </button>
              
                  <button
                    onClick={handleRemoveClick}
                    className="text-white mx-2 px-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              )}
              
              {image === null ? (
    <img
      src={profile}
      alt="Profile Image"
      className="w-full h-full object-cover"
    />
  ) : (
    <img
      src={image}
      alt="Profile Image"
      className="w-full h-full object-cover"
    />
  )}
          
        </div>
      </div>
      <div className="text-center mt-4 mb-5">
      <div className="flex flex-row justify-center items-center">
        <div className="text-center font-semibold pr-2">Username:</div>
        {editUsername ? (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        ) : (
          <div className="text-center">{username}</div>
        )}
        {editUsername ? (
          <button className="block bg-sky-600 hover:bg-sky-800 text-white text-center font-bold uppercase text p-2 rounded-full w-20 h-10 ml-14 mt-4" onClick={openModal}>Save</button>
        ) : (
          <button 
          className="block bg-[#E65F2B] hover:bg-slate-600 text-white text-center font-bold uppercase text p-2 rounded-full w-20 h-10 ml-40" onClick={handleEditUsername}>Edit</button>
        )}
      </div>
      <div className="flex flex-row justify-center items-center">
        <div className="text-left font-semibold pr-2">Email:</div>
        {editEmail ? (
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          <div className="text-left">{email}</div>
        )}
        {editEmail ? (
          <button className="block bg-sky-600 hover:bg-sky-800 text-white text-center font-bold uppercase text p-2 rounded-full w-20 h-10 ml-14 mt-4" onClick={openModal}>Save</button>
        ) : (
          <button className="block bg-[#E65F2B] hover:bg-slate-600 text-white text-center font-bold uppercase text p-2 rounded-full w-20 h-10 ml-14 mt-4" onClick={handleEditEmail}>Edit</button>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 bg-black">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Enter Your Password To Verify</h2>
            <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-2/3 text-gray-500 flex items-center justify-center h-full focus:outline-none mt-2"
                      style={{ transformOrigin: "center" }} // Center icon vertically
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 4.586l-6.707-6.707-1.414 1.414L8.586 10l-6.707 6.707 1.414 1.414L10 13.414l6.707 6.707 1.414-1.414L11.414 10l6.707-6.707-1.414-1.414L10 4.586zM5.293 13L10 17.707l4.707-4.707L15.293 13 10 18.293 4.707 13 5.293 13zm0-6l4.707 4.707-1.414 1.414L4.879 8l4.707-4.707 1.414 1.414L5.293 7zm7.414-3.707L10 2.293l1.293 1.293L12.707 4.5l-2-2zM13 6.707l1.707-1.707 1.414 1.414L14.5 8l2 2-1.414 1.414L13 9.293l-2 2-1.414-1.414L11.5 8l-2-2L8.293 4.293 10 2.586 13 5.586zm3.707 7.414L17.707 13l-4.707 4.707-1.414-1.414L16.5 13l-4.707-4.707 1.414-1.414L18.707 12l-1.707 1.707z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.86 5.14A4 4 0 0110 6c1.418 0 2.824.567 3.868 1.645a1 1 0 101.732-.993A6 6 0 0010 4a6 6 0 00-6 6c0 1.418.567 2.824 1.645 3.868a1 1 0 00.993 1.732A6 6 0 014 10a6 6 0 016-6c.97 0 1.918.231 2.773.667a1 1 0 00.874-1.82A7.963 7.963 0 0010 2a8 8 0 00-8 8c0 2.183.88 4.15 2.31 5.59a1 1 0 101.42-1.42A6.004 6.004 0 014 18a6 6 0 01-6-6c0-1.183.34-2.32.985-3.29a1 1 0 10-1.83-.88A7.963 7.963 0 000 10a8 8 0 008 8c3.453 0 6.39-2.177 7.536-5.218a1 1 0 10-1.85-.765A6.02 6.02 0 0114 14a6 6 0 01-3.532-1.146a1 1 0 00-.768-.106l-.105.046z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
            <div className="mt-4">
            {editUsername ? (
                         <button
                         className="bg-[#E65F2B] text-white rounded-[10px] h-10 w-[120px] font-bold py-2 px-4 shadow focus:outline-none focus:shadow-outline mr-10"
                         onClick={updateUsername}
                       >
                         Confirm
                       </button>
                      ) : (
                        <button
                        className="bg-[#E65F2B] text-white rounded-[10px] h-10 w-[120px] font-bold py-2 px-4 shadow focus:outline-none focus:shadow-outline mr-10"
                        onClick={updateUserEmail}
                      >
                        Confirm
                      </button>
                      )}
             
              <button
                className="ml-4 text-gray-500 hover:text-gray-800 font-semibold"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
            <div className="flex justify-center">
  
              <button
                style={{ backgroundColor: "#D12222" }}
                className="bg-teal-400 hover:bg-teal-600 text-white font-bold uppercase text mx-auto p-2 rounded-full w-40 h-10"
                onClick={() => handleDelete()}
              >
                Delete Account
              </button>
            </div>
            {isDeleteModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 bg-black">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Enter Your Password To Verify</h2>
            <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="border py-2 px-3 text-grey-800 w-full rounded-xl shadow-md"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-2/3 text-gray-500 flex items-center justify-center h-full focus:outline-none mt-2"
                      style={{ transformOrigin: "center" }} // Center icon vertically
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 4.586l-6.707-6.707-1.414 1.414L8.586 10l-6.707 6.707 1.414 1.414L10 13.414l6.707 6.707 1.414-1.414L11.414 10l6.707-6.707-1.414-1.414L10 4.586zM5.293 13L10 17.707l4.707-4.707L15.293 13 10 18.293 4.707 13 5.293 13zm0-6l4.707 4.707-1.414 1.414L4.879 8l4.707-4.707 1.414 1.414L5.293 7zm7.414-3.707L10 2.293l1.293 1.293L12.707 4.5l-2-2zM13 6.707l1.707-1.707 1.414 1.414L14.5 8l2 2-1.414 1.414L13 9.293l-2 2-1.414-1.414L11.5 8l-2-2L8.293 4.293 10 2.586 13 5.586zm3.707 7.414L17.707 13l-4.707 4.707-1.414-1.414L16.5 13l-4.707-4.707 1.414-1.414L18.707 12l-1.707 1.707z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.86 5.14A4 4 0 0110 6c1.418 0 2.824.567 3.868 1.645a1 1 0 101.732-.993A6 6 0 0010 4a6 6 0 00-6 6c0 1.418.567 2.824 1.645 3.868a1 1 0 00.993 1.732A6 6 0 014 10a6 6 0 016-6c.97 0 1.918.231 2.773.667a1 1 0 00.874-1.82A7.963 7.963 0 0010 2a8 8 0 00-8 8c0 2.183.88 4.15 2.31 5.59a1 1 0 101.42-1.42A6.004 6.004 0 014 18a6 6 0 01-6-6c0-1.183.34-2.32.985-3.29a1 1 0 10-1.83-.88A7.963 7.963 0 000 10a8 8 0 008 8c3.453 0 6.39-2.177 7.536-5.218a1 1 0 10-1.85-.765A6.02 6.02 0 0114 14a6 6 0 01-3.532-1.146a1 1 0 00-.768-.106l-.105.046z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
            <div className="mt-4">
              <button
                className="bg-[#E65F2B] text-white rounded-[10px] h-10 w-[120px] font-bold py-2 px-4 shadow focus:outline-none focus:shadow-outline mr-10"
                onClick={onDelete}
              >
                Confirm
              </button>
              <button
                className="ml-4 text-gray-500 hover:text-gray-800 font-semibold"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
</div>

  
              
  
            

            
          </div>
        </div>
      
    </>
  );
  
}
