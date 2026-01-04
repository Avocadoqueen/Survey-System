# Survey Backend API Endpoints

**Base URL:** `http://localhost:3000`

## Authentication Endpoints

### Register User
- **POST** `/api/auth/register`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "username": "johndoe"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User created successfully",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token_here"
  }
  ```

### Login
- **POST** `/api/auth/login`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token_here"
  }
  ```

## Survey Endpoints (Auth Required)

All survey endpoints require authentication. Include token in header:
```
Authorization: Bearer <your_jwt_token>
```

### Get All Surveys
- **GET** `/api/surveys`
- **Auth Required:** Yes

### Get Survey by ID
- **GET** `/api/surveys/:id`
- **Auth Required:** Yes

### Create Survey
- **POST** `/api/surveys`
- **Auth Required:** Yes

### Update Survey
- **PUT** `/api/surveys/:id`
- **Auth Required:** Yes

### Delete Survey
- **DELETE** `/api/surveys/:id`
- **Auth Required:** Yes

## Question Endpoints (Auth Required)

### Get Questions by Survey ID
- **GET** `/api/questions/survey/:surveyId`
- **Auth Required:** Yes

### Create Question
- **POST** `/api/questions`
- **Auth Required:** Yes

### Update Question
- **PUT** `/api/questions/:id`
- **Auth Required:** Yes

### Delete Question
- **DELETE** `/api/questions/:id`
- **Auth Required:** Yes

## Response Endpoints (Auth Required)

### Get Response by Question ID
- **GET** `/api/responses/question/:questionId`
- **Auth Required:** Yes

### Create Response
- **POST** `/api/responses`
- **Auth Required:** Yes

### Update Response
- **PUT** `/api/responses/:id`
- **Auth Required:** Yes

### Delete Response
- **DELETE** `/api/responses/:id`
- **Auth Required:** Yes

## User Endpoints

### Get All Users
- **GET** `/api/users`
- **Auth Required:** Yes

### Get User by ID
- **GET** `/api/users/:id`
- **Auth Required:** Yes

### Create User
- **POST** `/api/users`
- **Auth Required:** No

### Update User
- **PUT** `/api/users/:id`
- **Auth Required:** Yes

### Delete User
- **DELETE** `/api/users/:id`
- **Auth Required:** Yes

## Notes for Frontend Integration

1. **Authentication Flow:**
   - First, register/login to get a JWT token
   - Store the token (in localStorage, sessionStorage, or state)
   - Include the token in the `Authorization` header for protected routes: `Authorization: Bearer <token>`

2. **CORS:** Already configured to allow all origins (update in production)

3. **Error Handling:** All endpoints return JSON with `message` and `error` fields on failure

4. **Base URL:** Use `http://localhost:3000` for development

