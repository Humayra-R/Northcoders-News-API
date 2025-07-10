**NC News API**

Due to termination of hosting service, endpoints are currently non-functional and will be updated once a suitable hosting service is selected.

Hosted Version (Render): https://nc-news-xrc9.onrender.com/api

NC News is a RESTful API intended to mimic the building of a real world backend service (e.g. Reddit) which provides information to the front end architecture called The Coders Correspondence.

Hosted Version (Netlify, front-end): https://coders-correspondence.netlify.app/

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names). Please check that these .env files are .gitignored.

Setup for running locally:
    1. Ensure node version 21.2.0 or above is installed
    2. Fork the repository and run command git clone https://github.com/Humayra-R/Northcoders-News-API.git
    3. cd into Northcoders-News-API
    4. Run command npm install
