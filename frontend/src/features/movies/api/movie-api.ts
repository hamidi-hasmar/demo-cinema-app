import Constants from "expo-constants";
import { Platform } from "react-native";

import {
  MovieBookingOptionsResponse,
  MovieListResponse,
  MovieResponse,
  SeatLocksResponse,
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

export async function fetchSeatLocks(showtimeId: number) {
  const response = await fetch(`${API_BASE_URL}/api/showtimes/${showtimeId}/seats`);

  if (!response.ok) {
    throw new Error("Unable to load seats");
  }

  const result = (await response.json()) as SeatLocksResponse;

  if (!result.success) {
    throw new Error("Unable to load seats");
  }

  return result.data.locks;
}

export async function lockSeat(showtimeId: number, seatNumber: string, clientId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/showtimes/${showtimeId}/seats/${seatNumber}/lock`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientId }),
    },
  );

  if (!response.ok) {
    throw new Error("Seat is no longer available");
  }
}

export async function releaseSeat(showtimeId: number, seatNumber: string, clientId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/showtimes/${showtimeId}/seats/${seatNumber}/lock`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientId }),
    },
  );

  if (!response.ok) {
    throw new Error("Unable to release seat");
  }
}

export function createSeatEvents(showtimeId: number, clientId: string) {
  if (typeof EventSource === "undefined") {
    return null;
  }

  return new EventSource(
    `${API_BASE_URL}/api/showtimes/${showtimeId}/seats/events?clientId=${encodeURIComponent(
      clientId,
    )}`,
  );
}
