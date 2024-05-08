<h1 align="center">Basic Authentication & JWT Authorization</h1>

An orthodox "Basic Authentication" modern example using the enterprise-graded backend framework, Nest.js.
Basic authentication is a method of authinticating with a service, using a username and a password.
Throughout the application resources, the application uses JWT tokens to authorize or deny users' access appropriately.

## Tech Stack

1. Utilizing the usage of JSON Web Tokens to generate the access and refresh tokens and encoding within them a useful payload.
2. Database used for this project is MongoDB. I picked this one for it's simplicity and ability to quickly define a schema, export a model and connect to the database to start working with it.
3. Nest.js for it's modularity, and many many out-of-the-box tools offered, as well as writing in TypeScript.

## Approach

The approach implemented in this project is an access token is used to access the protected resources, whenever an access token is expired, the refresh token will be come in handy to refresh the access token. An access token expiration is 1 day from it's issue date, and a refresh token's expiration date is 180 days from issue date.

### Order of things

In order to keep the access token fresh, when ever a user is logged in, the tokens are checked and validated, and refreshed in database level, and then returned to the user as a JSON response and an http-cookie is set for both tokens.

### Continuesly refreshing the access token

The operation of accessing the refresh token endpoint to refresh the access token in my eyes is the frontend's responsibility. for setting the correct interceptors when getting a 403, reaching to the refresh endpoint and retry the protected resource if token was refreshed.

# Demo

### Free-for-all Resource

> GET Endpoint: /demo/free-for-all

All types of users can access this resource limitless, and regardless for the auth state.

### Only logged users

> GET Endpoint: /demo/logged-only

Only logged users with a valid, not-expired and signed JWT access-token can access this endpoint.

### Only logged-verified users

> GET Endpoint: /demo/verified-only

Only logged users with a valid, not-expired and signed JWT access-token can access this endpoint (decoded payload contains validity state).

### Only guests

> GET Endpoint: /demo/guest-only

Only guests, unregistered / logged-out users that has an invalid access token / no access token, are allowed to access the endpoint.

# Documentation

### Environment Variables
Firstly set the project's ```.env``` file. Then, set a ```MONGO_URI``` and ```JWT_SECRET``` values, that's it.
after running locally you can test the server on port 3000, using Postman.

### Register

> POST Endpoint: /auth/register

Expected body of:
```
username: string between x and y.
password: string between x and y.
email: string formatted as <email prefix>@<email host>
```

For successful operations, the http status will be ```201 Created```, if user exists, or bad input inserted the response will be ```400 Bad Request```, for any other issue, expected status code will be ```Internal Server Error 500```.

### Verify

A verification token is issued for new users registered. The verification mechanism works as followed:
1. Token is issued on registration
2. Verification token is returned after successful registration (real world app would be an email)
3. When the endpoint for verification reached we search if the token exists in the database
3. if exists, we try and verify and decode it's payload
4. if token successfuly decoded, we compare the logged user's access token payload with the verification token payload, in order to be sure that the logged user is verifying them-selves.
5. verification token is deleted from database
6. user record on db updated to verified = true.
7. a newly access token is issued, with "verified" flag set to true.

> GET Endpoint: /auth/verify?token=TOKEN_IS_HERE

A ```200 OK``` will be sent on a successful verification, ```401 Unauthorized``` on a user who is verifying not them-selves. ```400 Bad Request``` on a missing token / invalid token requests, any other error will issue ```500 Internal Server Error```.

### Logout

> DELETE Endpoint: /auth/logout

For successful operation, response expected is ```204 NO CONTENT```, all related http cookies with tokens shall be expired and therefore deleted and also the session related to the user is deleted. No bad request for this one, only ```Internal Server Error 500``` if some server-side or database issue occured.

### Login

> POST Endpoint: /auth/login

Expected body of:
```
username: string.
password: string.
```

For successful operations, the http status will be ```200 OK```, if user credentials are bad, or bad input inserted the response will be ```400 Bad Request```, for any other issue, expected status code will be ```Internal Server Error 500```.

### Refresh

> POST Endpoint: /auth/refresh

For successful operations, the http status will be ```201 Created```, if user token is bad ```401 Unauthorized``` will be returned with a new http-cookie set for the access token. For a user that isn't authorized a ```403 Forbidden``` will be returned. Any other errors thrown, expected status code will be ```Internal Server Error 500```.

> For any improvements suggestions please open an issue!