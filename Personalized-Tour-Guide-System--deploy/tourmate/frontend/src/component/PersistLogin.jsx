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
      <div class="flex justify-center items-center h-screen bg-slate-600">
  <div class="inline-block h-16 w-16 animate-spin rounded-full border-8 border-solid border-current border-r-transparent align-middle motion-reduce:animate-[spin_1.5s_linear_infinite]">
    <span class="absolute -m-px h-px w-px  overflow-hidden whitespace-nowrap border-0 p-0 clip:rect(0,0,0,0)">
      Loading...
    </span>
  </div>
</div>
    )
  }

  if (!auth?.accessToken) {
    navigate("/login"); // Redirect to the login page
    return null;
  }

  return <Outlet />;
};

export default PersistLogin;
