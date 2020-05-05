const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MenuItemSchema = new Schema({
    menu: [
            {
                menuItemId: "string",
                itemName: "string",
                itemDescription: "string",
                itemImgName: "string",
                itemImgPath: "string",
                itemIngredients: "string",
                itemRecipe: "string",
                itemPrice: Number,
                itemActive: Boolean,
                itemCategoryId: "string"
            }
          ]
},{
    timestamps: true
});

// MenuItemSchema.virtual('id').get(function(){
//     return this._id;
// });


// Export the model
module.exports = mongoose.model('MenuItem', MenuItemSchema);