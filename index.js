const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


//middleware 
app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://mahenurislam97:XQE43t5Iz7oFJucz@cluster0.neajhbt.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //create a database with a collection
    const blogCollection = client.db('blogDB').collection('blogs');

    //post single data endpoint
    app.post('/blogs', async(req, res) => {
        const blog = req.body;
        console.log(blog)
        const result = await blogCollection.insertOne(blog);
        // console.log(result);
        res.send(result);
    })

    //get all blogs data endpoint
  
    app.get('/blogs', async(req, res) => {
        const result = await blogCollection.find().toArray();
        // console.log(result);
        res.send(result);
    })

    //delete a blog 
    app.delete("/blogs/:id", async(req, res)=>{
        const id = req.params.id;
        console.log('delete', id);
        //query for delete using id field
        const query = {
            _id: new ObjectId(id),
        }
        const result= await blogCollection.deleteOne(query)
        res.send(result);
    })

    //get single data using id
    app.get("/blogs/:id", async(req, res)=>{
        const id = req.params.id;
        console.log('id', id);
        //query for delete using id field
        const query = {
            _id: new ObjectId(id),
        }
        const result= await blogCollection.findOne(query)
        res.send(result);
    })


    //update single blog 
    app.put('/blogs/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {
            _id: new ObjectId(id),
        }
        const data = req.body;
        const options = {upert:true};
        const updatedData ={
            $set:{
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                category: data.category,
                images: data.images,
                imagePrevieUrls: data.imagePrevieUrls,
            }
        }
        const result = await blogCollection.updateOne(filter,updatedData,options)
        res.send(result);

    })
    const category = [
        {
          category_id: 1,
          category_title: "Cricket",
        },
        {
          category_id: 2,
          category_title: "Soccer",
        },
        {
          category_id: 3,
          category_title: "Tennis",
        },
        {
          category_id: 4,
          category_title: "Boxing",
        },
        {
          category_id: 5,
          category_title: "Car Race",
        },
        {
          category_id: 6,
          category_title: "Swimming",
        },
      ];
      
      app.get("/", (req, res) => {
        res.send("winsports server is running");
      });
      
      
      
      //make an api
      app.get('/category', (req, res)=>{
          res.send(category);
      })
      
      
      
      
      app.listen(port, () => {
        console.log(`server is running on port: ${port}`);
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

