
const mongoose = require('mongoose');

const connectDB = async () => {
    try {

        const conn = await mongoose.connect('mongodb://localhost:27017/AuthGoogle', {
            useNewUrlParser: true,
            useUnifiedTopology: true 
        });
        console.log('-->  DATABASE CONNECTED  <--');
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectDB;


// module.exports = mongoose.connect('mongodb://localhost:27017/AuthGoogle', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true 
// },()=>{
//     console.log('database connected')
// });