import '@testing-library/jest-dom';

const fetch = require('node-fetch');

global.Request = fetch.Request;
global.Response = fetch.Response;
global.Headers = fetch.Headers;
global.fetch = fetch;
