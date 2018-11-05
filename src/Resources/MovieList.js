import { unstable_createResource } from "react-cache";
import {
  TMDB_BASE_URL,
  TMDB_API_KEY,
  TMDB_IMG_BASE_URL,
  TMDB_PLACEHOLDER_BASE_URL,
} from "../Config";

export const fetchMovieList = async page => {
  const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`;
  const { results } = await fetch(url).then(res => res.json());

  const formattedResults = results.map(raw => ({
    type: "movie",
    id: raw.id,
    title: raw.title,
    score: raw.vote_average,
    synopsis: raw.overview,
    posterUrl: raw.poster_path
      ? `${TMDB_IMG_BASE_URL}${raw.poster_path}`
      : null,
    placeholderPosterUrl: raw.poster_path
      ? `${TMDB_PLACEHOLDER_BASE_URL}${raw.poster_path}`
      : null,
    releaseYear: new Date(raw.release_date).getFullYear(),
  }));

  return formattedResults;
};

export const MovieListResource = unstable_createResource(fetchMovieList);
