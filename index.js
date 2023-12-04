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
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Create collections
    const blogCollection = client.db("blogDB").collection("blogs");
    const wishlistCollection = client.db("blogDB").collection("wishlist");
    const commentsCollection = client.db("blogDB").collection("comments");

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
          image: data.image,
        },
      };
      const result = await blogCollection.updateOne(filter, updatedData, options);
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
    });

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

    // Endpoint to remove a blog from the wishlist
app.delete("/wishlist/:id", async (req, res) => {
  const blogId = req.params.id;

  try {
    const result = await wishlistCollection.deleteOne({
      _id: new ObjectId(blogId),
    });

    if (result.deletedCount > 0) {
      res.json({ success: true, message: "Blog removed from wishlist successfully" });
    } else {
      res.status(404).json({ error: "Blog not found in the wishlist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



    // Endpoints for comments
  // Endpoint to add a comment to a blog
  app.post("/comments/:id", async (req, res) => {
    const blogId = req.params.id;
    const { comment, email } = req.body;

    // Fetch blog details to get authorEmail
    const blogDetails = await blogCollection.findOne({
      _id: new ObjectId(blogId),
    });

    if (!blogDetails) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const { authorEmail } = blogDetails;

    // Check if the user's email is equal to the author's email
    if (user && user.email === authorEmail) {
      return res.status(403).json({ error: "You cannot comment on your own blog" });
    }

    try {
      const result = await commentsCollection.insertOne({
        blogId: new ObjectId(blogId),
        comment,
        email,
        timestamp: new Date(),
      });

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

    // Endpoint to fetch comments for a specific blog
    app.get("/comments/:id", async (req, res) => {
      const blogId = req.params.id;

      try {
        const result = await commentsCollection.find({ blogId: new ObjectId(blogId) }).toArray();
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

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

// This should be outside the try block, and app.listen should only be called once
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
