var FileSaver = require('file-saver');
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const { request } = require("https");

const app = express();
app.use(express.json()); //this is to accept data in json format
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true})); 


app.get("/", function(request,response){
    // console.log(__dirname);
    response.sendFile(__dirname + "/index.html");
});

app.get("/Data", (req, res) => {
    const data = JSON.parse(fs.readFileSync("data.json"));
  
    res.send(`
      <div>Name: ${data.username}</div>
      <div>Phone: ${data.phone}</div>
      <div>Address: ${data.address}</div>
      ${data.marks.map(
        (mark, index) => `<div>Subject ${index + 1}: ${mark}</div>`
      )}
      <div>Total Marks: ${data.totalMarks}</div>
      <div>Average Marks: ${data.average}</div>
      <div>Grade: ${data.grade}</div>
    `);
  });

app.post("/formPost", (req, res) => {
    const marks = [];
    for (let mark of req.body.tel) marks.push(Number(mark));
  
    const totalMarks = marks.reduce((total, num) => total + num, 0);
    const average = totalMarks / 5;
  
    let grade = "F";
    if (average >= 90) grade = "A";
    else if (average >= 80) grade = "B";
    else if (average >= 70) grade = "C";
    else if (average >= 33) grade = "D";
  
    console.log("Total Marks:", totalMarks);
    console.log("Average:", average);
    console.log("Grade:", grade);
  
    const data = {
      username: req.body.username[0],
      phone: req.body.phone,
      address: req.body.username[1],
      marks,
      totalMarks,
      average,
      grade,
    };
    fs.appendFileSync("data.json", JSON.stringify(data, null, 2));
  
    res.send("Your details has been recorded!!");
  });

app.listen(3000, function(){
    console.log("Server started on port 3000");
});