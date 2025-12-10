🎬 Movie API (IMDB + RapidAPI Integration)

This project is a Node.js Express API that fetch movie data from the IMDB API on RapidAPI
it include:

Search the movies by keyword
Fetch the moves details by IMBD ID
Simulate pages of the movies using alphabet-base queries
Full error handling
RapidAPI request helper
input validation for safe request

## FEATURES

1. Fetch Movies by Page

Uses letters a → z as "pages".
Example:

Page 1 → letter a

Page 2 → letter b

Endpoint returns movies based on the selected letter.

2. Search by queries string:

GET/movies/search/?q=spider
Supports
minimum 2 characters
Trims whitespace
Validate the query

3.  Get Movie Details By IMDb ID

Fetches full movie details using the title ID:
GET /movies/tt0944947

## Technologies Used

Node.js
Express
Axios
Express-error-handler
Custom AppError class
RapidAPI (IMDb API)

## Product Structure

your-project/
│
├── README.md
├── package.json
├── server.js
├── .env
│
├── controller/
│ └── movieController.js
│
├── routes/
│ └── movieRoutes.js
│
├── utils/
│ └── appError.js
│
├── middleware/
│ └── errorHandler.js ← NEW
│
└── node_modules/

## Setup instruction

1.  install dependencies
    npm install

2.  create a .env file
    API_KEY=your_rapidapi_key_here
    PORT=5000

3.  Start the Server
    npm start

## Environment Variables

| Variable  | Description                |
| --------- | -------------------------- |
| `API_KEY` | Your RapidAPI IMDB API key |

## API Endpoints

1. Get Movies by Page
   GET /movies?page=1

## Query params:

page → number from 1–26

Page maps to alphabet letters (1=a, 2=b, ..., 26=z)

2. Search Movies
   GET /movies/search?q=matrix

## Validations:

Query is required

Query must be at least 2 characters

3. Get Movie Details by ID
   GET /movies/:id

Example:

GET /movies/tt0944947

## Validations:

ID must match: tt + 7–8 digits

Invalid IDs return 400

Missing/unknown IDs return 404

⚙️ How It Works

1. RapidAPI Helper Function

## The helper (callRapidAPI) handles:

Axios GET requests

Timeouts

Missing data

API response errors

Network errors

Throws AppError for cleaner handling

2. Controller Logic

## Get Movies by Page

Converts page number → alphabet letter

Queries IMDB autocomplete

Returns movie list

Search Movies

Trims query

Validates length

Calls IMDB autocomplete

Get Movie Details

Validates IMDb ID using regex

Calls title/get-overview-details

Returns full movie info

## Error Handling

The API uses a centralized AppError class that standardizes responses like:

400 Bad Request

404 Not Found

500 Internal Server Error

Custom IMDB errors from RapidAPI

Invalid movie ID example:

{
"status": "error",
"message": "Invalid IMDb ID format."
}

📝 Example Responses
Search Movies
{
"status": "success",
"results": 10,
"data": [...]
}

Movie Detail
{
"status": "success",
"data": {
"id": "tt0944947",
"title": "Game of Thrones",
"year": 2011
}
}

## Future Improvements

Add caching with Redis

Add full movie streaming links

Add actor details endpoint

Add pagination to search results

Build frontend UI
