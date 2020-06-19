
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CitySchema = new Schema({
    city: [
        {
            id: "string",
            state_name: "string",
            city_name: "string",
            zip_code: "string"
        }
    ]
},{
    timestamps: true
});

// CitySchema.virtual('id').get(function(){
//     return this._id;
// });


// Export the model
module.exports = mongoose.model('City', CitySchema);