const mongoose = require ('mongoose')
const connectDB = async()=>{
    try{
await mongoose.connect(process.env.MONGO_URI)
        console.log('DB Connected');
    }
    catch(error){
        console.log('DB not Connected');
        console.log(error);
    }
}
module.exports = { connectDB }