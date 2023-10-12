import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
      <div className="bg-black h-screen flex flex-col items-center justify-center">
        <h1 className="text-9xl text-red-600 mt-36">Unauthorized Access</h1>
        <br />
        <h1 className="text-8xl text-white">401 Error</h1>
        <div className="flex-grow">
          <button
            onClick={goBack}
             class="bg-transparent  mt-10 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
}

export default Unauthorized
