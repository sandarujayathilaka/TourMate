const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        
    } catch (err) {
        
    }
}

module.exports = connectDB