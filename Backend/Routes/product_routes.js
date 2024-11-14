const express = require('express');
const productRoutes = express.Router();
const Product  = require('../Models/product_models');

productRoutes.post('/stocksIn', async (req, res) => {
   const { userEmail, products } = req.body;
   
   try {
      const productPromises = products.map(product => {
         return Product.findOneAndUpdate(
            { userEmail: userEmail, productId: product.productId }, 
            { 
               productName: product.productName,
               stocksBalance: product.stocksBalance 
            },
            { upsert: true, new: true, setDefaultsOnInsert: true } 
         );
      });

      await Promise.all(productPromises); 
      res.status(200).json({ message: "Stock data updated successfully" });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating stock data", error });
   }
});

module.exports = productRoutes;



