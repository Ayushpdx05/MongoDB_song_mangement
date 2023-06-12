
//the express and moonge and certin methods
//using app instead of router
const express = require("express");
const mongoose =  require("mongoose");
const Song = require("./models/songs");
const app = express();
const methodOverride = require('method-override');


app.use(methodOverride('_method'));
app.use(express.static("static"));
app.use(express.json())
app.use(express.urlencoded({extended: false}));

//local host file
const port = 3000;

//this is so i can use pug instead of html 
app.set('view engine', 'pug');



//my connection with my name and password
mongoose.connect( 
    "mongodb+srv://:@cluster0.ozpv7ex.mongodb.net/music_db?retryWrites=true&w=majority"
);

//the connection
const connection = mongoose.connection;
//making sure i know when the data base has been coneected properly
connection.once("open",() => {
    console.log("MongoDB database connection established successfully");
});

app.get("/",(req,res) =>  {
    res.render("index");
});


// Add song route
app.get('/add', (req, res) => {
    res.render('add');
  });
  
  app.post('/add', async (req, res) => {
    try {
      // Extract song details from the request body
      const { title, artist, genre, popularity, releaseDate } = req.body;
  
      // Create a new song object
      const newSong = new Song({
        title,
        artist,
        genre,
        popularity,
        releaseDate
      });
  
      // Save the song to the database
      const savedSong = await newSong.save();
  
      res.redirect('/user_song'); // Redirect to the list page or any other desired location
    } catch (err) {
      console.error('Error adding song', err);
      res.status(500).send('An error occurred while adding the song');
    }
  });
  



  //app to get search 
  app.get('/search', async (req, res) => {
    try {
      const genres = await Song.distinct('genre');
      //rendering the search along side the song and the array
      res.render('search', { genres, songs: [] });
    } catch (err) {
      console.error('Error fetching genres', err);
      res.status(500).send('An error occurred while fetching genres');
    }
  });
  //redirected to search results 
  app.get('/search/results', async (req, res) => {
    try {
      const { genre } = req.query;
      let query = {};
  
      if (genre) {
        query.genre = genre;
      }
  
      const songs = await Song.find(query);
      const genres = await Song.distinct('genre');
  
      if (songs.length > 0) {
        res.render('search', { songs, genres });
      } else {
        res.render('search', { songs: [], genres });
      }
    } catch (err) {
      console.error('Error searching songs', err);
      res.status(500).send('An error occurred while searching songs');
    }
  });
   
 
  //app to delte the specific id when click on the button
  app.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the song by its ID and delete it
      await Song.findByIdAndDelete(id);
  
      res.sendStatus(204); // Send a success status code (204: No Content) to indicate successful deletion
    } catch (err) {
      console.error('Error deleting song', err);
      res.status(500).send('An error occurred while deleting the song');
    }
  });
  







//app to get the user song 
app.get("/user_song", async (req,res) =>{
   try {
    const songs = await Song.find();
    res.render("user_song",{ songs });
   } catch (error) {
        res.status(500).json({error: "failed to get songs"});
   } 
});

//the local host of the console log
app.listen(port, () => {
console.log(`App is listening at http://localhost${port}`);
});

