# Survey Management System

A full-stack survey application built with Node.js, Express, TypeScript, and MySQL.

## Features

- User Authentication (Register, Login, JWT)
- Create and manage surveys
- Add questions to surveys
- Collect and view survey responses
- Protected API routes

## Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MySQL with Sequelize ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Frontend:** React

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL database
- npm

### Installation

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd survey-system

A complete TypeScript/Express backend for managing surveys, questions, and responses.

## Features

- **User Authentication**: JWT-based registration and login
- **Survey Management**: Full CRUD operations for surveys
- **Question Management**: Create, update, delete, and reorder questions
- **Response Collection**: Submit and retrieve survey responses with validation
- **Access Control**: Owner-based permissions for surveys and responses

1. Install dependencies
- npm install

2. Create a .env file in the root folder with:

PORT=3000
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=survey_system

3. Create the MySQL database
- CREATE DATABASE survey_system;

4. Start the backend server
- npm run dev

5. Access the application

Backend API: 
http://localhost:3000
Frontend: 
http://localhost:3001






## Project Structure

```
survey-system/
├── src/
│   ├── config/
│   │   └── database.ts          # MySQL connection pool
│   ├── controllers/
│   │   ├── survey.controller.ts  # Survey CRUD operations
│   │   ├── question.controller.ts # Question management
│   │   └── response.controller.ts # Response submission/retrieval
│   ├── database/
│   │   └── migrations/
│   │       ├── 001_create_users_table.sql
│   │       └── 002_create_survey_tables.sql
│   ├── middleware/
│   │   └── auth.middleware.ts    # JWT authentication
│   ├── models/
│   │   ├── survey.model.ts       # Survey database operations
│   │   ├── question.model.ts     # Question database operations
│   │   └── response.model.ts     # Response database operations
│   ├── routes/
│   │   ├── auth.routes.ts        # Authentication endpoints
│   │   ├── survey.routes.ts      # Survey endpoints
│   │   ├── question.routes.ts    # Question endpoints
│   │   └── response.routes.ts    # Response endpoints
│   └── index.ts                  # Express app entry point
├── package.json
├── tsconfig.json
└── .env.example
```

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Create database**:
   ```sql
   CREATE DATABASE survey_system;
   ```

4. **Run migrations**:
   Execute the SQL files in `src/database/migrations/` in order.

5. **Start the server**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Surveys
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/surveys` | Create survey | Yes |
| GET | `/api/surveys` | List all surveys | Optional |
| GET | `/api/surveys/:id` | Get survey by ID | Optional |
| GET | `/api/surveys/:id/full` | Get survey with questions | Optional |
| PUT | `/api/surveys/:id` | Update survey | Yes (owner) |
| DELETE | `/api/surveys/:id` | Delete survey | Yes (owner) |

### Questions
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/surveys/:surveyId/questions` | Add question | Yes (owner) |
| GET | `/api/surveys/:surveyId/questions` | List questions | Optional |
| PUT | `/api/surveys/:surveyId/questions/reorder` | Reorder questions | Yes (owner) |
| PUT | `/api/questions/:id` | Update question | Yes (owner) |
| DELETE | `/api/questions/:id` | Delete question | Yes (owner) |

### Responses
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/surveys/:surveyId/responses` | Submit response | Optional |
| GET | `/api/surveys/:surveyId/responses` | Get survey responses | Yes (owner) |
| GET | `/api/responses/my` | Get my responses | Yes |
| GET | `/api/responses/:id` | Get response by ID | Yes |
| DELETE | `/api/responses/:id` | Delete response | Yes (owner) |

## Question Types

- `text` - Free text input
- `single_choice` - Select one option
- `multiple_choice` - Select multiple options
- `rating` - Numeric rating (1-10)
- `boolean` - Yes/No answer

## Example Requests

### Create a Survey
```bash
curl -X POST http://localhost:3000/api/surveys \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Customer Feedback", "description": "Help us improve"}'
```

### Add a Question
```bash
curl -X POST http://localhost:3000/api/surveys/1/questions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question_text": "How satisfied are you?",
    "question_type": "single_choice",
    "options": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
    "is_required": true
  }'
```

### Submit a Response
```bash
curl -X POST http://localhost:3000/api/surveys/1/responses \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"question_id": 1, "answer_text": "Very Satisfied"},
      {"question_id": 2, "answer_text": "Great service!"}
    ]
  }'
```
Usage 
All protected routes require a JWT token:
Authorization: Bearer <your_token>

Author
Built by Eniola Abdul

## License
ISC
