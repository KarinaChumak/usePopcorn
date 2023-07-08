import { useEffect, useState } from 'react';
import StarRating from './StarRating';
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

const KEY = `3d65c7e6`;

function App() {
  const [movies, setMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const [selectedId, setSelectedId] = useState(null);

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError('');
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error(
              'Something went wrong in the application'
            );
          const data = await res.json();

          if (data.Response === 'False') {
            throw new Error('Movie not found');
          }
          setMovies(data.Search);
          setError('');
        } catch (err) {
          if (err.name !== 'AbortError') {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError('');
        return;
      }

      handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  function handleSelectMovie(selectedMovieId) {
    setSelectedId((selectedId) =>
      selectedId === selectedMovieId ? null : selectedMovieId
    );
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatchedMovie(newWatchedMovie) {
    setWatchedMovies((watchedMovies) => [
      ...watchedMovies,
      newWatchedMovie,
    ]);
  }

  function handleDeleteWatched(watchedId) {
    setWatchedMovies((watchedMovies) =>
      watchedMovies.filter((movie) => movie.imdbId !== watchedId)
    );
  }

  return (
    <div className="App">
      <Nav>
        <SearchInput query={query} setQuery={setQuery}></SearchInput>
        <ResultsFound movies={movies}></ResultsFound>
      </Nav>
      <Main>
        <Box>
          {isLoading && <Loader></Loader>}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              handleSelectMovie={handleSelectMovie}
            ></MovieList>
          )}
          {error && <ErrorMessage message={error}></ErrorMessage>}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleAddWatchedMovie}
              watchedMovies={watchedMovies}
            ></MovieDetails>
          ) : (
            <>
              <WatchedSummary
                watchedMovies={watchedMovies}
              ></WatchedSummary>
              <WatchedList
                watchedMovies={watchedMovies}
                onClickDelete={handleDeleteWatched}
              ></WatchedList>
            </>
          )}
        </Box>
      </Main>
    </div>
  );
}

export default App;

function Loader() {
  return <p className="loader"> Loading...</p>;
}

function Nav({ children }) {
  return (
    <nav className="nav-bar">
      <Logo></Logo>
      {children}
    </nav>
  );
}

function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatchedMovie,
  watchedMovies,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');

  const watchedMovieIds = watchedMovies.map((movie) => movie.imdbId);
  const isWatched = watchedMovieIds.includes(selectedId);
  const currentMovieRating = watchedMovies.find(
    (movie) => movie.imdbId === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newMovie = {
      imdbId: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
    };

    onAddWatchedMovie(newMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );

          if (!res.ok)
            throw new Error(
              'Something went wrong in the application'
            );
          const data = await res.json();
          setMovie(data);
          setIsLoading(false);

          if (data.Response === 'False') {
            throw new Error('Movie not found');
          }
        } catch (err) {
          console.log(err);
        }
      }

      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = `usePopcorn`;
      };
    },
    [title]
  );
  useEffect(
    function () {
      function callback(e) {
        if (e.code === 'Escape') {
          onCloseMovie();
        }
      }
      document.addEventListener('keydown', callback);

      return function () {
        document.removeEventListener('keydown', callback);
      };
    },
    [onCloseMovie]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>{' '}
            <img src={poster} alt={`Poster of ${title}`}></img>
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {isWatched ? (
                <p>You rated this movie {currentMovieRating} ⭐️</p>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  ></StarRating>
                  {userRating && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
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

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>🛑</span> {message}
    </p>
  );
}
function SearchInput({ query, setQuery }) {
  return (
    <input
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
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

function MovieList({ movies, handleSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies.map((movie) => (
        <Movie
          key={movie.imdbID}
          movie={movie}
          handleSelectMovie={handleSelectMovie}
        ></Movie>
      ))}
    </ul>
  );
}

function Movie({ movie, handleSelectMovie }) {
  return (
    <li
      className="movieItem"
      onClick={() => handleSelectMovie(movie.imdbID)}
    >
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
  const avrgUserRating =
    average(watchedMovies.map((m) => m.userRating)) || 0;
  const avrgImdbRating =
    average(watchedMovies.map((m) => m.imdbRating)) || 0;
  const avrgRuntime =
    average(watchedMovies.map((m) => m.runtime)) || 0;
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
          <p>{avrgImdbRating.toFixed(2)}</p>
        </div>
        <div>
          <p>🌟</p>
          <p>{avrgUserRating.toFixed(2)}</p>
        </div>
        <div>
          <p>⏳</p>
          <p>{avrgRuntime.toFixed(0)} min</p>
        </div>
      </div>
    </div>
  );
}

function WatchedList({ watchedMovies, onClickDelete }) {
  return (
    <ul className="list">
      {watchedMovies.map((movie) => (
        <WatchedMovie
          key={movie.imdbId}
          movie={movie}
          onClickDelete={onClickDelete}
        ></WatchedMovie>
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onClickDelete }) {
  return (
    <li className="movieItem">
      <img src={movie.poster} alt={movie.title}></img>
      <p className="movieTitle">{movie.title}</p>
      <div className="ratedMovieInfo">
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onClickDelete(movie.imdbId)}
        >
          X
        </button>
      </div>
    </li>
  );
}
