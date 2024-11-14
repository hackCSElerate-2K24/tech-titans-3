const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
   userEmail: {
      type: String,
      required: true,
   },
   productId: {
      type: String,
      required: true,
   },
   productName: {
      type: String,
      required: true,
   },
   stocksBalance: {
      type: Number,
      default: 0,
   },
   price : {
     type : Number,
     default : 0
   },
   productOut : {
    type : Number,
    default : 0
   }
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
