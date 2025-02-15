// import necessary dependancies

require('dotenv').config(); 
const express = require('express');
const mysql = require('mysql2');

// create express app

const app = express();

app.use(express.json());
const defaultPort = 3000;


// create database connection


const connectt =mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.PORT,
    // host: 'localhost',
    // user: 'root',
    // password: 'p2ssw0rd',
    // database: 'mydatabases',
    // port: 3307

});

const promiseconnection = connectt.promise();

connectt.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

  // connectt.connect()
  //   .then(() => {
  //       console.log('Connected to MySQL');
  //   })
  //   .catch((err) => {
  //       console.error('Error connecting to the database:', err);
  //   });

app.post('/add-user', async (req, res)=>{
    const {firstname, lastname, age, location, email} = req.body;
    


    if (!firstname || !lastname || !age || !location){
      return res.status(400).json({ message: 'All fields are required' })
    }


    const queryCheck = 'SELECT * FROM users WHERE email = ?';
    const valuesCheck = [email];

    try {
      const [rows] = await promiseconnection.query(queryCheck, valuesCheck);

      if(rows.length>0){
        return res.status(400).json({message:"User already exists"})

      }

      const query = 'INSERT INTO users (firstname, lastname, age, location, email) VALUES (?, ?, ?, ?, ?) '
      const values = [firstname, lastname, age, location, email]


    
      const [results] = await promiseconnection.query(query, values);
      res.status(200).json({ message: 'User added sucessfully', userId: results.insertId})
      console.log("User created")
      
    } catch (error) {
      console.error('Error inserting data into the database', error)
      res.status(500).json({message:'Failed to add user'})
      
    }


})

const PORT = defaultPort;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});






