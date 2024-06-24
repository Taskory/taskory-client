
// API URL
const API_BASE_URI: string = 'http://localhost:8080';
const API_VERSION_URL: string = '/api/v1';
export const API_URL: string = API_BASE_URI + API_VERSION_URL;

export const ACCESS_TOKEN: string = 'accessToken';

export const OAUTH2_REDIRECT_URI: string = 'http://localhost:3000/oauth2/redirect';

export const GOOGLE_AUTH_URL: string = `${API_BASE_URI}/oauth2/authorize/google?redirect_uri=${OAUTH2_REDIRECT_URI}`;
// export const FACEBOOK_AUTH_URL: string = `${API_BASE_URL}/oauth2/authorize/facebook?redirect_uri=${OAUTH2_REDIRECT_URI}`;
// export const GITHUB_AUTH_URL: string = `${API_BASE_URL}/oauth2/authorize/github?redirect_uri=${OAUTH2_REDIRECT_URI}`;
