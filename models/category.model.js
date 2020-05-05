const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategorySchema = new Schema({
    category: [
        {
        categoryId: "string",
        categoryName: "string"
    }
    ]
},{
    timestamps: true
});

// CategorySchema.virtual('id').get(function(){
//     return this._id;
// });


// Export the model
module.exports = mongoose.model('Category', CategorySchema);