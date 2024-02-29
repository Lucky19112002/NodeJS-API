const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/productModels");
const app = express();

//middleware

app.use(express.json()); //parse the incoming requests with json
app.use(express.urlencoded({ extended: false })); //parse the incoming requests with form data url

//routes

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/blog", (req, res) => {
  res.send("Hello Blog");
});

//get product data form server
app.get("/products", async (req, res) => {
  try {
    const products = await Products.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//get product find by id data form server
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//Update the data in database
//when we want to update anting we use put operation.
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    //cannot find the product we search for
    if (!product) {
      res
        .status(404)
        .json({ message: `cannot find the product with ID ${id}.` });
    }
    //if sucessfully updated
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status.send({ message: error.message });
  }
});

//delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res
        .status(404)
        .json({ message: `cannot find the product with ID ${id}.` });
    }
    //if sucessfully updated
    res.status(200).json(product);
  } catch (error) {
    res.status.send({ message: error.message });
  }
});

//create a new product
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://lckpathan:KtkgmaBVRFd7agYe@luckycluster.kv78z2e.mongodb.net/Node-API?retryWrites=true&w=majority&appName=LuckyCluster"
  )
  .then(() => {
    app.listen(3000, () => {
      console.log(`Node API app is running on port 3000`);
    });
    console.log("Connected to Mango DB");
  })
  .catch((err) => console.log(err));
