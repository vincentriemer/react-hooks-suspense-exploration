import { unstable_createResource as createResource } from "react-cache";
import {
  TMDB_BASE_URL,
  TMDB_API_KEY,
  TMDB_IMG_BASE_URL,
  TMDB_PLACEHOLDER_BASE_URL,
} from "../Config";

async function fetchMovieDetails(movieId) {
  const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`;
  const result = await fetch(url).then(res => res.json());

  const formattedResult = {
    id: result.id,
    title: result.title,
    score: result.vote_average,
    synopsis: result.overview,
    posterUrl: result.poster_path
      ? `${TMDB_IMG_BASE_URL}${result.poster_path}`
      : null,
    placeholderPosterUrl: result.poster_path
      ? `${TMDB_PLACEHOLDER_BASE_URL}${result.poster_path}`
      : null,
    releaseYear: new Date(result.release_date).getFullYear(),
  };

  return formattedResult;
}

export const MovieDetailResourcce = createResource(fetchMovieDetails);
