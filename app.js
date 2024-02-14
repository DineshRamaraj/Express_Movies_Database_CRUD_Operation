const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const app = express();

app.use(express.json());

let db = null;

const initializationDbServer = async () => {
  try {
    db = await open({
      filename: path.join(__dirname, "moviesData.db"),
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializationDbServer();

// GET Movies API

app.get("/movies/", async (request, response) => {
  const getMoviesList = `
    SELECT
        *
    FROM
        movie;`;
  const dbResponse = await db.all(getMoviesList);
  //   console.log(dbResponse);
  response.send(
    dbResponse.map((eachItem) => ({
      movieName: eachItem.movie_name,
    }))
  );
});

// GET Movie API

app.get("/movies/:movieId", async (request, response) => {
  //   console.log(request.params);
  const { movieId } = request.params;
  const getMoviesList = `
      SELECT
          *
      FROM
          movie
      WHERE
      movie_id =${movieId}`;

  const dbResponse = await db.get(getMoviesList);

  //   console.log(dbResponse);
  response.send({
    movieId: dbResponse.movie_id,
    directorId: dbResponse.director_id,
    movieName: dbResponse.movie_name,
    leadActor: dbResponse.lead_actor,
  });
});

// POST Movies API

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const addMovieItem = `
        INSERT INTO
            movie (director_id, movie_name, lead_actor)
        VALUES
            ('${directorId}', '${movieName}', '${leadActor}');`;

  const dbResponse = await db.run(addMovieItem);
  response.send("Movie Successfully Added");
});

// PUT Movie API

app.put("/movies/:movieId", async (request, response) => {
  //   console.log(request.params);
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const getMoviesList = `
      UPDATE
        movie
      SET 
        director_id='${directorId}',
        movie_name ='${movieName}',
        lead_actor='${leadActor}'
      WHERE
        movie_id = '${movieId}';`;

  const dbResponse = await db.run(getMoviesList);

  response.send("Movie Details Updated");
});

// DELETE Movie API

app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieItem = `
    DELETE
        FROM
        movie
    WHERE
        movie_id=${movieId};`;
  const dbResponse = await db.run(deleteMovieItem);
  response.send("Movie Removed");
});

// GET Directors API

app.get("/directors/", async (request, response) => {
  const getMoviesList = `
    SELECT
        *
    FROM
        director;`;
  const dbResponse = await db.all(getMoviesList);
  //   console.log(dbResponse);
  response.send(
    dbResponse.map((eachItem) => ({
      directorId: eachItem.director_id,
      directorName: eachItem.director_name,
    }))
  );
});

// GET Director API

app.get("/directors/:directorId/movies", async (request, response) => {
  const { directorId } = request.params;
  //   console.log(request.params);
  const getMoviesList = `
    SELECT
        *
    FROM
        movie
    WHERE 
        director_id = ${directorId}`;
  const dbResponse = await db.all(getMoviesList);
  console.log(dbResponse);
  response.send(
    dbResponse.map((eachItem) => ({
      movieName: eachItem.movie_name,
    }))
  );
});

module.exports = app;
