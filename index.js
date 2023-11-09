const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

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
