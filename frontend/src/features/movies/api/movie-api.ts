import Constants from "expo-constants";
import { Platform } from "react-native";

import {
  MovieBookingOptionsResponse,
  MovieListResponse,
  MovieResponse,
} from "../types";

function getApiBaseUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (Platform.OS === "web") {
    return "http://localhost:5000";
  }

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(":")[0];

  return host ? `http://${host}:5000` : "http://localhost:5000";
}

const API_BASE_URL = getApiBaseUrl();

export async function fetchMovies() {
  const response = await fetch(`${API_BASE_URL}/api/movies`);

  if (!response.ok) {
    throw new Error("Unable to load movies");
  }

  const result = (await response.json()) as MovieListResponse;

  if (!result.success) {
    throw new Error("Unable to load movies");
  }

  return result.data;
}

export async function fetchMovie(movieId: number) {
  const response = await fetch(`${API_BASE_URL}/api/movies/${movieId}`);

  if (!response.ok) {
    throw new Error("Unable to load movie");
  }

  const result = (await response.json()) as MovieResponse;

  if (!result.success) {
    throw new Error("Unable to load movie");
  }

  return result.data;
}

export async function fetchMovieBookingOptions(movieId: number) {
  const response = await fetch(`${API_BASE_URL}/api/movies/${movieId}/booking-options`);

  if (!response.ok) {
    throw new Error("Unable to load booking options");
  }

  const result = (await response.json()) as MovieBookingOptionsResponse;

  if (!result.success) {
    throw new Error("Unable to load booking options");
  }

  return result.data;
}
