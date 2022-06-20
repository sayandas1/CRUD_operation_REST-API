const express = require('express');
const mongoose =  require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const dbDriver = 'mongodb+srv://<>:<>@cluster0.9eruc.mongodb.net/CRUD?retryWrites=true&w=majority';

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
})

const Product = new mongoose.model("Product",productSchema);

//Create product 
app.post('/api/v1/product/new',async(req,res)=>{
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})

//Read product 
app.get('/api/v1/products',async(req,res)=>{
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })
})

//Update product 
app.put('/api/v1/product/:id',async(req,res)=>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return res.send(500).json({
            success: false,
            message: "Product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,
        {
            new: true,
            useFindAndModify: false,
            runValidators: true
        })

    res.status(200).json({
        success: true,
        product
    })
})

//Delete product 
app.delete('/api/v1/product/:id',async(req,res)=>{
    let product = await Product.findById(req.params.id);
    
    if(!product){
        return res.send(500).json({
            success: false,
            message: "Product not found"
        })
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})

mongoose.connect(dbDriver,{useNewUrlParser: true, useUnifiedTopology: true})
.then(result=>{
    app.listen(4000,()=>{
        console.log(`Server is running on http://localhost:4000`);
    })
}).catch(err=>{
    console.log("Database is not connected");
})

