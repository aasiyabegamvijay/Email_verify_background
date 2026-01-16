const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({
    pname: {
        type : String,
        required : [true, 'Product name is required']
    },
    pprice: {
        type : String,
        required : [true, 'Product price is required'],
        max : [6, 'Price should be within Lakhs']
    }
    },{
        timestamps : true
    }
)
module.exports = new mongoose.model('Product' , userSchema)