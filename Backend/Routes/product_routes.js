const express = require('express');
const productRoutes = express.Router();
const Product = require('../Models/product_models');

productRoutes.post('/stocksIn', async (req, res) => {
   const { userEmail, products } = req.body;
   
   try {
      const productPromises = products.map(product => {
         return Product.findOneAndUpdate(
            { userEmail: userEmail, productId: product.productId }, 
            { 
               productName: product.productName,
               $inc: { stocksBalance: product.stocksBalance }, 
               price: product.price,
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

productRoutes.post('/getProduct', async (req, res) => {
    const { userEmail, productId } = req.body;
 
    try {
       const foundProduct = await Product.findOne({
          userEmail: userEmail,
          productId: productId
       });
 
       if (foundProduct) {
          res.status(200).json(foundProduct);
       } else {
          res.status(404).json({ message: "Product not found" });
       }
    } catch (error) {
       console.error(error);
       res.status(500).json({ message: "Error retrieving product data", error });
    }
 });
 


productRoutes.post('/stocksOut', async (req, res) => {
    const { userEmail, products } = req.body;
 
    try {
       const productPromises = products.map(product => {
          return Product.findOneAndUpdate(
             {
                userEmail: userEmail,
                productId: product.productId
             },
             {
                $inc: { stocksBalance: -product.productOut }  
             },
             { new: true } 
          );
       });
 
       await Promise.all(productPromises); 
       res.status(200).json({ message: "Stock data decremented successfully" });
    } catch (error) {
       console.error(error);
       res.status(500).json({ message: "Error decrementing stock data", error });
    }
 });
 
module.exports = productRoutes;
