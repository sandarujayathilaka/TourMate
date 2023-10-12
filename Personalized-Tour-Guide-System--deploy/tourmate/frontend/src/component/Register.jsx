import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import React from 'react';
import logo from '../assert/slide1.jpg';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from '../hooks/useAuth';
import { useNavigate} from 'react-router-dom';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';
const GET_User_URL = '/getUsers';

function Register() {

  const userRef = useRef();
  const errRef = useRef();
  const roleRef = useRef();
  const navigate = useNavigate();
  const { auth,setAuth } = useAuth();
  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [employee,setEmployee] = useState([])
  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [role, setRole] = useState('');
  const [validRole, setValidRole] = useState(false);
  const [roleFocus, setRoleFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [reshowPassword, setReShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  let have = false;
  
  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);



  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd]);


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);
      console.log(pwd);
      console.log(validMatch);
    // if button enabled with JS hack

    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      toast.error("Invalid Entry");
      return;
    }
    
    // const isPasswordMatched = employee.some((data) => {
    //   // Assuming `data.password` is the password property in the employee data
    //   return data === user;
    // });

    // if(isPasswordMatched){
    try {
      console.log(user);
      console.log(pwd);
     
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ user, pwd,matchPwd,email }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
    
      console.log(response.status);
      console.log('hi');
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response))
      //setSuccess(true);
      toast.success("Registered successfully");
      toast.success("Please login");
      //clear state and controlled inputs
      setUser('');
      setPwd('');
      setMatchPwd('');
      setRole('');
      setTimeout(() => {
        navigate("/login");
       }, 1500);
    } catch (err) {
      if (!err?.response) {
        toast.error('No Server Response');
      } else if (err.response?.status === 409) {
        toast.error('Username Taken. Try another name or Please Login');
      } else if (err.response?.status === 406) {
        toast.error('Email is already registered.');
      } else if (err.response?.status === 401) {
        toast.error('Password mismatching');
      }else {
        toast.error('Registration Failed');
      }
    //  errRef.current.focus();
     }
    // }else{
    //   toast.error("You are not authorized person")
    // }
  };

  const handlePasswordChange = (e) => {
    setPwd(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const retogglePasswordVisibility = () => {
    setReShowPassword((prevState) => !prevState);
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <div className="flex items-center justify-center h-full bg-white">
          <div
  className="absolute mx-auto inset-0 flex items-center bg-no-repeat opacity-80 "
  style={{
    backgroundImage: `url(${logo})`,
    backgroundSize: "cover",
  }}
></div>
<div
  className="absolute mx-auto inset-0 flex items-center justify-center w-[700px] h-[650px] bg-no-repeat bg-slate-500 rounded-[65px] opacity-90 mt-8"
  style={{
   // backgroundImage: `url(${logo})`,
    backgroundSize: "cover",
  }}
></div>
            <div className="relative w-[822px] h-[662px] rounded-[65px] flex justify-center">
              
              <div className="relative flex flex-col items-center justify-center h-full  ">
                <h1 className="text-white text-4xl font-bold mb-10">Create an Account</h1>
                <form className="flex flex-col items-center " onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-72 h-12 px-4 mb-5 rounded"
                    required
                    onChange={(e) => {
                       setUser(e.target.value);
                    }}
                  />
                   <div className="ml-[10px] text-sm text-red-800">
                  {user.length > 0 && (
                    <>
                      {user.length < 4 && (
                        <div>
                        - Password should be at least 4 characters long.
                        </div>
                      )}
                    </>
                  )}
                </div>
                  <input
               className="w-72 h-12 px-4 mb-5 rounded"
               required
                type="text"
                placeholder="Email"
                name="email"
                id="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
                   <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} // Update input type based on showPassword state
                  placeholder="Password"
                  className="w-72 h-12 px-4 mb-8 rounded pr-10" // Added pr-10 to reserve space for the icon
                  onChange={(e) => {
                    setPwd(e.target.value);
                 }}
                  required
                />
                 
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-2/3 text-gray-500 flex items-center justify-center h-full focus:outline-none"
                  style={{ transformOrigin: 'center' }} // Center icon vertically
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
              <div className="ml-[120px] text-sm text-red-800">
                  {pwd.length > 0 && (
                    <>
                      {pwd.length < 8 && (
                        <div>
                          - Password should be at least 8 characters long.
                        </div>
                      )}
                      {!/[a-z]/.test(pwd) && (
                        <div>
                          - Password should contain at least one lowercase
                          letter.
                        </div>
                      )}
                      {!/[A-Z]/.test(pwd) && (
                        <div>
                          - Password should contain at least one uppercase
                          letter.
                        </div>
                      )}
                      {!/[0-9]/.test(pwd) && (
                        <div>- Password should contain at least one digit.</div>
                      )}
                      {!/[!@#$%]/.test(pwd) && (
                        <div>
                          - Password should contain at least one special
                          character (!@#$%).
                        </div>
                      )}
                      {pwd.length > 24 && (
                        <div>
                          - Password should be at most 24 characters long.
                        </div>
                      )}
                    </>
                  )}
                </div>
              <div className="relative">
                <input
                  type={reshowPassword ? 'text' : 'password'} // Update input type based on showPassword state
                  placeholder="Re-enter Password"
                  className="w-72 h-12 px-4 mb-8 rounded pr-10" // Added pr-10 to reserve space for the icon
                  onChange={(e) => {
                    setMatchPwd(e.target.value);
                 }}
                  required
                />
                <button
                  type="button"
                  onClick={retogglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-2/3 text-gray-500 flex items-center justify-center h-full focus:outline-none"
                  style={{ transformOrigin: 'center' }} // Center icon vertically
                >
                  {reshowPassword ? (
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
              <div className="ml-[120px] text-sm text-red-800">
                  {matchPwd.length > 0 && (
                    <>
                      {matchPwd.length < 8 && (
                        <div>
                          - Password should be at least 8 characters long.
                        </div>
                      )}
                      {!/[a-z]/.test(matchPwd) && (
                        <div>
                          - Password should contain at least one lowercase
                          letter.
                        </div>
                      )}
                      {!/[A-Z]/.test(matchPwd) && (
                        <div>
                          - Password should contain at least one uppercase
                          letter.
                        </div>
                      )}
                      {!/[0-9]/.test(matchPwd) && (
                        <div>- Password should contain at least one digit.</div>
                      )}
                      {!/[!@#$%]/.test(matchPwd) && (
                        <div>
                          - Password should contain at least one special
                          character (!@#$%).
                        </div>
                      )}
                      {pwd.length > 24 && (
                        <div>
                          - Password should be at most 24 characters long.
                        </div>
                      )}
                    </>
                  )}
                </div>
                  <button className="w-32 h-10 bg-[#E65F2B] text-white font-bold rounded">
                    Create Account
                  </button>
                </form>
                {errMsg && <p className="text-red-500 mt-4">{errMsg}</p>}
                <h6 className="text-white text-sm mt-8 mb-8">
                  Already have an account <a className="text-[#E65F2B]" href="/login">Login</a>
                </h6>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Register;
