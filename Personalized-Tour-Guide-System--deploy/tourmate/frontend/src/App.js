import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Test from "./component/Test";
import NavBar from "./component/NavBar";
import Home from "./component/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./component/Register";
import Login from "./component/Login";
import Profile from "./component/Profile";
import { AuthProvider000 } from "./context/AuthProvider";
import RequireAuth from "./component/RequireAuth";
import Unauthorized from "./component/Unauthorized";
import PersistLogin from "./component/PersistLogin";
import WeatherWidget from "./component/WeatherWidget";
import WeatherForecast from "./component/WeatherForecast";

import Footer from "./component/Footer";
import DisplayHiddenSpecific from "./component/placesManagement/DisplayHiddenSpecific";
import UpdatePassword from "./component/UpdatePassword";
import DisplayAllHidden from "./component/placesManagement/DisplayAllHidden";
import UpdatePlace from "./component/placesManagement/UpdatePlace";

import Analytics from "./component/placesManagement/Analytics";
import AddFavPlace from "./component/placesManagement/AddFavPlace";
import DisplayFavPlace from "./component/placesManagement/DisplayFavPlace";
import Experience from "./component/Experience";
import CreateExperience from "./component/CreateExperience";
import UpdateExperience from "./component/UpdateExperience";

import SearchPlaces from "./component/SearchPlaces";
import WishList from "./component/WishList";
import UpdateNote from "./component/UpdateNote";
import Map from "./component/placesManagement/Map";
const ROLES = {
  User: 2001
};


function App() {
  return (
    <>
    <NavBar />
    <Routes>
    <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
   
    

        <Route path="/searchPlaces" element={<SearchPlaces />} />
        
        <Route path="/updateNote/:placeName" element={<UpdateNote />} />

       
        <Route path="/displayallhidden" element={<DisplayAllHidden />} />
        <Route path="/map" element={<Map />} />
       
        
     
        <Route element={<PersistLogin />}>
          
        <Route path="myProfile" element={<Profile />} />
                
                <Route path="updateUserpass/:user" element={<UpdatePassword />} />
                <Route path="/displayfav/:user" element={<DisplayFavPlace />} />
                <Route path="/displayhidden/:userId" element={<DisplayHiddenSpecific />} />
                <Route path="/updateplace/:id" element={<UpdatePlace />} />
        <Route path="/analytics/:userid" element={<Analytics />} />
        <Route path="/wishList/:user" element={<WishList />} />
               
        <Route path="/addfavplace/:user" element={<AddFavPlace />} />
       

       <Route path="/Exp/:user" element={<Experience />} />
       <Route path="/addExp/:user" element={<CreateExperience />} />
       <Route path="/updateExp/:id" element={<UpdateExperience />} />
       <Route path="/displayallhidden/:user" element={<DisplayAllHidden />} />
       <Route path="/:user" element={<Home />} />
       <Route path="/map/:user" element={<Map />} />
                {/* <Route path="departments" element={<AgDepartment />} />
                <Route path="allemployee/:id" element={<AllEmployee />} />
                <Route path="employeetask/:id" element={<EmployeeTask />} />
                <Route path="updatepass/:eid" element={<UpdatePassword />} /> */}
              </Route>
       
      </Routes>
   <Footer/>
    <ToastContainer />
    </>
  );
}

export default App;