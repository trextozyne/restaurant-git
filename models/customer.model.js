
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CustomerSchema = new Schema({
    customer: [
        {
            id: "string",
            customer_name: "string",
            city_id: "string",
            address: "string",
            contact_phome: "string",
            email: "string",
            confirmation_code: "string",
            password: "string"
        }
    ]
},{
    timestamps: true
});

// CustomerSchema.virtual('id').get(function(){
//     return this._id;
// });


// Export the model
module.exports = mongoose.model('Customer', CustomerSchema);