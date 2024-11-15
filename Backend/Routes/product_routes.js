const express = require('express');
const productRoutes = express.Router();
const Product = require('../Models/product_models');

// Add stock to products
productRoutes.post('/stocksIn', async (req, res) => {
    const { userEmail, products } = req.body;

    if (!userEmail || !Array.isArray(products)) {
        return res.status(400).json({ message: "Invalid data format. 'userEmail' is required and 'products' should be an array." });
    }

    try {
        const productPromises = products.map(product => {
            return Product.findOneAndUpdate(
                { userEmail, productId: product.productId },
                {
                    productName: product.productName,
                    $inc: { stocksBalance: parseInt(product.stocksBalance, 10) || 0 },
                    price: parseInt(product.price, 10) || 0,
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

// Get specific product details
productRoutes.post('/getProduct', async (req, res) => {
    const { userEmail, productId } = req.body;

    if (!userEmail || !productId) {
        return res.status(400).json({ message: "Invalid data format. 'userEmail' and 'productId' are required." });
    }

    try {
        const foundProduct = await Product.findOne({userEmail, productId});

        if (foundProduct) {
            res.status(200).json(foundProduct);
        } else {
            res.status(404).json({ message: "Product not found in your shop" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving product data", error });
    }
});

// Reduce stock from products
productRoutes.post('/stocksOut', async (req, res) => {
    const { userEmail, products } = req.body;

    if (!userEmail || !Array.isArray(products)) {
        return res.status(400).json({ message: "Invalid data format. 'userEmail' is required and 'products' should be an array." });
    }

    try {
        const productPromises = products.map(product => {
            return Product.findOneAndUpdate(
                { userEmail, productId: product.productId },
                { $inc: { stocksBalance: -product.productOut } },
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

// Retrieve all products for a user
productRoutes.post('/products', async (req, res) => {
    const { userEmail } = req.body;

    if (!userEmail) {
        return res.status(400).json({ message: "Invalid data format. 'userEmail' is required." });
    }

    try {
        const products = await Product.find({ userEmail });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving products", error });
    }
});

module.exports = productRoutes;
