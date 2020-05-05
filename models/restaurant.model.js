const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RestaurantSchema = new Schema({
        completeOrder: [
            {
                menuId: "string",
                menuItemId: "string",
                optionDescription: "string",
                optionTotal: "Number",
                dataMax: "Number",
                name: [],
                price: [],
                dataSingleproduct: "Boolean",
                require: "Boolean",
                innerOptions: [
                    {
                        name: [],
                        price: []
                    }
                ],
                extraOptions: []
            }
        ]
},{
    timestamps: true
});

// RestaurantSchema.virtual('id').get(function(){
//     return this._id;
// });


// Export the model
module.exports = mongoose.model('Restaurant', RestaurantSchema);