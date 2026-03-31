import axios from 'axios';
import { getAPIBaseURL } from './config';

// Create axios instance
export const client = axios.create({
  baseURL: getAPIBaseURL(),
});

// For backward compatibility with the previous mock client structure if needed
// (Though it seems only AuthCallback was using it)
export const api = client;
