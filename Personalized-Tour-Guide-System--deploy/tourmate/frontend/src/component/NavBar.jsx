import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import profile from "../assert/user.jpg"
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

function NavBar() {
  const { auth } = useAuth();
  const { user } = auth;
  const [image, setImage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
 

  useEffect(() => {
    async function getUser() {
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
        
        const res = await axios.get(
          `users/getUser/${user}`,config
        );
        console.log(res.data);
       
        setImage(res.data.image);
        
      } catch (err) {
        toast.error(err);
      }
    }

    getUser();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

 

   const logout = async()=> {
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
      '/logout',config
      );
      setIsModalOpen(!isModalOpen);
      navigate("/login", { replace: true }); 
      
    } catch (err) {
      toast.error(err);
    }
  }

  return (
    <nav class="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 ">
      <div class="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4 ">
        <a href="#" class="flex items-center mr-8">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            class="h-8 mr-3"
            alt="Flowbite Logo"
          />
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white mr-5">
            TourMate
          </span>
        </a>
        <button
          data-collapse-toggle="navbar-solid-bg"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-solid-bg"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div class="hidden mr-32 w-full md:block md:w-auto" id="navbar-solid-bg">
          <ul class="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
          
            {user ? (
              <>
              <li>
              <a
                href={`/${user}`}
                class="block py-2 pl-3 pr-4 text-black bg-black-700 rounded md:bg-transparent md:text-black-700 md:p-0 md:dark:text-black-500 dark:bg-black-600 md:dark:bg-transparent"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href={`/displayallhidden/${user}`}
                class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Hidden Places
              </a>
            </li>
            <li>
              <a
                href={`/displayfav/${user}`}
                class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
               My Favourites
              </a>
            </li>
            <li>
              <a
                href={`/displayhidden/${user}`}
                class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                My Hiddens
                </a>
                </li>
                
                <li>
                <a
                href={`/wishList/${user}`}
                class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                 >
                My wishlist
              </a>
            </li>
            <li>
              <a
                href={`/exp/${user}`}
                class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
               My Experiences
              </a>
            </li>
            
           
            <li>
              <a
                href={`/map/${user}`}
                class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Secret Spots Map
              </a>
            </li>
            <li>
              <Link to={`/addfavplace/${user}`}>
              <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white p-1 px-4 border border-blue-500 hover:border-transparent rounded">
                Place Addition
              </button>
              </Link>
            </li>
            <li>
           <div className="relative w-8 h-8 overflow-hidden rounded-full ml-4">
      <img
        src={image || profile}
        alt="logo"
        className="w-full h-full object-cover cursor-pointer"
        onClick={toggleModal}
      />
      
      {isModalOpen && (
        <div className="fixed flex items-center z-50">
        <div className="bg-slate-300 w-50 p-4 rounded-lg shadow-lg mr-1">
          <ul>
            <li>
              <a href="/myProfile">My Profile</a>
            </li>
            <li>
              <a href={`/updateUserpass/${user}`}>Update Password</a>
            </li>
            <li>
              <a href={`/analytics/${user}`}>My Analytics</a>
            </li>
            <li><button onClick={logout}>Log out</button>
            
            </li>
          </ul>
        </div>
        </div>
      )}
    </div>
    </li>
            </>
             ) : (
              <>
              <li>
              <a
                href="/"
                class="block py-2 pl-3 pr-4 text-black bg-black-700 rounded md:bg-transparent md:text-black-700 md:p-0 md:dark:text-black-500 dark:bg-black-600 md:dark:bg-transparent"
                aria-current="page"
              >
                Home
              </a>
            </li>
               <li>
              <a
                href="/displayallhidden"
                class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Hidden Places
              </a>
            </li>
           
            <li>
              <a
                href="/map"
                class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Secret Spots Map
              </a>
            </li>
            <li>
              <a
                href="/login"
                class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Login
              </a>
            </li>
           
    </>
             )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar