import invariant from "invariant";

invariant(
  process.env.REACT_APP_TMDB_API_KEY,
  `Missing TMDB API key, either set the REACT_APP_TMDB_API_KEY environment variable or add it to a .env file in the root folder of this project`
);

// API Config
export const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_PLACEHOLDER_BASE_URL = "https://image.tmdb.org/t/p/w92";
export const TMDB_IMG_BASE_URL = "https://image.tmdb.org/t/p/w780";

// Layout Config
export const HEADER_HEIGHT = 100;
export const FOOTER_HEIGHT = 150;
export const ITEM_WIDTH = 350;
export const ITEM_HEIGHT = 450;
export const ITEM_BORDER_RADIUS = 8;
