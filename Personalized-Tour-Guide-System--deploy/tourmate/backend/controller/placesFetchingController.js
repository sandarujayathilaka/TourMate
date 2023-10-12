const express = require('express');
const app = express();
// app.use(express.json());
// app.use(cors()); // Add the CORS middleware


//create a wish list
const fetchPlaces = async (req, res) => {
  
        const {coordinates} = req.body;
    
        console.log(coordinates)
        console.log(req.body)
    
        if (!coordinates) {
            return;
          }
    
        try {
            const apiKey = 'AIzaSyACdwaw1h6cATe6laoMWoayEniMemjgVkE';
            const { latitude, longitude } = coordinates;
      
            const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1000&type=tourist_attraction&key=${apiKey}`;
      
            const response = await fetch(apiUrl);
      
            if (!response.ok) {
              throw new Error('Failed to fetch recommendations');
            }
      
            const data = await response.json();
      
            if (data.status === 'INVALID_REQUEST') {
              throw new Error('Invalid request');
            }
      
            console.log(data);
      
            res.status(200).json(data);
            
          } catch (error) {
            res.status(500);
          }
        
        res.status(200).json();
  
 
};





module.exports = { 
    fetchPlaces
    };