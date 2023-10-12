import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; 
import { ToastContainer, toast } from "react-toastify";

function UpdateNote() {
  const { placeName } = useParams();
  const [note, setNote] = useState("");
  const [editingNote, setEditingNote] = useState("");
  const [isEditing, setIsEditing] = useState(true); 
  const navigate = useNavigate(); 
 
  useEffect(() => {
    async function getNote() {
      try {
        const response = await axios.get(`http://localhost:8080/wishlist/getNote/${placeName}`);
        setNote(response.data.note);
        setEditingNote(response.data.note); 
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    }

    getNote();
  }, [placeName]);

  const handleNoteUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/wishlist/updateWishList/${placeName}`, { note: editingNote });
      setIsEditing(false);
  
      toast.success("Note updated", {
        position: toast.POSITION.TOP_RIGHT,
      });
  
      setTimeout(() => {
        window.location.href = "/wishList"; 
      }, 2000); 
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const cancelEdit = () => {
    setIsEditing(false);
    setEditingNote(note); 
    navigate("/wishList"); 
  };

  return (
    <div className="mt-20 mb-48">
<div className="max-w-md mx-auto p-4 py-2 bg-white rounded-lg shadow-lg border border-blue-500">
  <h1 className="text-2xl font-bold mb-4">My personal note</h1>
  <div className="mb-4">
    {isEditing ? (
      <div>
        <textarea
          type="text"
          placeholder="Edit note"
          value={editingNote}
          onChange={(e) => setEditingNote(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
        />
        <div className="mt-2">
          <button
            onClick={handleNoteUpdate}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mr-2 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Save
          </button>
          <button
            onClick={cancelEdit}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <p className="text-gray-700">{note}</p>
    )}
  </div>
  <ToastContainer />
</div>
</div>

  );
}

export default UpdateNote;
