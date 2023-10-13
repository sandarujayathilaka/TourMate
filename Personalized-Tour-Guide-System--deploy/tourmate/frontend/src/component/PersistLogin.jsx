import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';
import useLocalStorage from "../hooks/useLocalStorage";

const PersistLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const [persist] = useLocalStorage('persist', false);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        
        await refresh();
        
      } catch (err) {
        
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    const handleBeforeUnload = async (event) => {
      event.preventDefault();
      if (persist && auth?.accessToken) {
        await refresh();
        
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      isMounted = false;
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [persist, auth?.accessToken, refresh]);

  useEffect(() => {
   
  }, [isLoading, auth?.accessToken]);

  if (!persist) {
    return <Outlet />;
  }

  if (isLoading) {
    return (
  <></>
    )
  }

  if (!auth?.accessToken) {
    navigate("/login"); // Redirect to the login page
    return null;
  }

  return <Outlet />;
};

export default PersistLogin;
