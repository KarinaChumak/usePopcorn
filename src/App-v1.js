import { useState } from 'react';
const tempMovieData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
  },
];

const tempWatchedData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur, 0) / arr.length;

function App() {
  const [movies, setMovies] = useState(tempMovieData);
  const [watchedMovies, setWatchedMovies] = useState(tempWatchedData);

  return (
    <div className="App">
      <Nav>
        <SearchInput></SearchInput>
        <ResultsFound movies={movies}></ResultsFound>
      </Nav>
      <Main>
        <Box>
          <MovieList movies={movies}></MovieList>
        </Box>
        <Box>
          <WatchedSummary
            watchedMovies={watchedMovies}
          ></WatchedSummary>
          <WatchedList watchedMovies={watchedMovies}></WatchedList>
        </Box>
      </Main>
    </div>
  );
}

export default App;

function Nav({ children }) {
  return (
    <nav className="nav-bar">
      <Logo></Logo>
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span className="emoji">🍿</span>
      <span>usePopcorn</span>
    </div>
  );
}

function SearchInput() {
  const [searchInput, setSearchInput] = useState(null);

  return (
    <input
      type="text"
      placeholder="Search movies..."
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
    ></input>
  );
}

function ResultsFound({ movies }) {
  return (
    <p className="resultsFound">Found {movies.length} results</p>
  );
}
function Main({ children }) {
  return <main>{children}</main>;
}

function MovieList({ movies }) {
  return (
    <ul className="list">
      {movies.map((movie) => (
        <Movie movie={movie}></Movie>
      ))}
    </ul>
  );
}

function Movie({ movie }) {
  return (
    <li className="movieItem">
      <img src={movie.Poster} alt={movie.Title}></img>
      <p className="movieTitle">{movie.Title}</p>
      <div className="year">
        <span>🗓️</span>
        <span>{movie.Year}</span>
      </div>
    </li>
  );
}
function Box({ children }) {
  const [isOpen, setisOpen] = useState(true);

  function handleToggleOpen() {
    setisOpen(() => !isOpen);
  }
  return (
    <div className="box">
      <button className="btn-toggle" onClick={handleToggleOpen}>
        {isOpen ? '–' : '+'}
      </button>

      {isOpen && children}
    </div>
  );
}

function WatchedSummary({ watchedMovies }) {
  const numMoviesWatched = watchedMovies.length;
  const avrgUserRating = average(
    watchedMovies.map((m) => m.userRating)
  );
  const avrgImdbRating = average(
    watchedMovies.map((m) => m.imdbRating)
  );
  const avrgRuntime = average(watchedMovies.map((m) => m.runtime));
  return (
    <div className="summary">
      <h3>Movies you watched</h3>
      <div className="summaryInfo">
        <div>
          <p>#️⃣</p>
          <p>{numMoviesWatched} movies</p>
        </div>
        <div>
          <p>⭐️</p>
          <p>{avrgImdbRating}</p>
        </div>
        <div>
          <p>🌟</p>
          <p>{avrgUserRating}</p>
        </div>
        <div>
          <p>⏳</p>
          <p>{avrgRuntime} min</p>
        </div>
      </div>
    </div>
  );
}

function WatchedList({ watchedMovies }) {
  return (
    <ul className="list">
      {watchedMovies.map((movie) => (
        <WatchedMovie movie={movie}></WatchedMovie>
      ))}
    </ul>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li className="movieItem">
      <img src={movie.Poster} alt={movie.Title}></img>
      <p className="movieTitle">{movie.Title}</p>
      <div className="ratedMovieInfo">
        <div>
          <p>⭐️</p>
          <p>{movie.imdbRating}</p>
        </div>
        <div>
          <p>🌟</p>
          <p>{movie.userRating}</p>
        </div>
        <div>
          <p>⏳</p>
          <p>{movie.runtime} min</p>
        </div>
      </div>
    </li>
  );
}
