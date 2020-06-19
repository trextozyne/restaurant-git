
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Restaurant_RegisterSchema = new Schema({
    Restaurant_Registr: [
        {
            id: "string",
            restaurant_name: "string",
            city_id: "string",
            address: "string",
            contact_phone: "string",
        }
    ]
},{
    timestamps: true
});

// Restaurant_RegistrSchema.virtual('id').get(function(){
//     return this._id;
// });


// Export the model
module.exports = mongoose.model('Restaurant_Registr', Restaurant_RegisterSchema);