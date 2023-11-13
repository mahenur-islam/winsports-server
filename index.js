const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://mahenurislam97:XQE43t5Iz7oFJucz@cluster0.neajhbt.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Create collections
    const blogCollection = client.db("blogDB").collection("blogs");
    const wishlistCollection = client.db("blogDB").collection("wishlist");

    // Endpoints for blogs
    app.post("/blogs", async (req, res) => {
      const blog = req.body;
      const result = await blogCollection.insertOne(blog);
      res.send(result);
    });

    app.get("/blogs", async (req, res) => {
      const result = await blogCollection.find().toArray();
      res.send(result);
    });

    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await blogCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await blogCollection.findOne(query);
      res.send(result);
    });

    app.put("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {
        _id: new ObjectId(id),
      };
      const data = req.body;
      const options = { upsert: true };
      const updatedData = {
        $set: {
          title: data.title,
          shortDescription: data.shortDescription,
          content: data.content,
          category: data.category,
          images: data.images,
          imagePrevieUrls: data.imagePrevieUrls,
        },
      };
      const result = await blogCollection.updateOne(
        filter,
        updatedData,
        options
      );
      res.send(result);
    });

    // Get all wishlist items
    app.get("/wishlist", async (req, res) => {
      try {
        const result = await wishlistCollection.find().toArray();
        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });h

    // Endpoint to add a blog to the wishlist
    app.post("/wishlist/:id", async (req, res) => {
      const blogId = req.params.id;

      try {
        // Find the blog by ID from the blogs collection
        const blog = await blogCollection.findOne({
          _id: new ObjectId(blogId),
        });

        if (!blog) {
          return res.status(404).json({ error: "Blog not found" });
        }

        // Add the blog to the wishlist collection
        const result = await wishlistCollection.insertOne(blog);
        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Additional endpoints...

    app.get("/", (req, res) => {
      res.send("Winsports server is running");
    });

    app.get("/category", (req, res) => {
      const category = [
        { category_id: 1, category_title: "Cricket" },
        { category_id: 2, category_title: "Soccer" },
        { category_id: 3, category_title: "Tennis" },
        { category_id: 4, category_title: "Boxing" },
        { category_id: 5, category_title: "Car Race" },
        { category_id: 6, category_title: "Swimming" },
      ];
      res.send(category);
    });

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);
