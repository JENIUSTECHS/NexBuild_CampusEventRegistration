# UniFirst Events – Campus Event Registration Platform

A full-stack campus event registration system built for first-year university students with approval-based workflows, seat locking, waitlists, and an organizer dashboard.

## Tech Stack
- **Frontend:** React (Vite), React Router, Axios, CSS3
- **Backend:** PHP 8.3, Laravel, Laravel Sanctum
- **Database:** MySQL

## Setup Instructions

### 1. Backend Setup
    cd backend
    composer install
    cp .env.example .env
    # Configure DB_DATABASE=campus_events, DB_USERNAME=root, DB_PASSWORD= in .env
    php artisan key:generate
    php artisan migrate --seed
    php artisan serve

### 2. Frontend Setup
    cd frontend
    npm install
    npm run dev

## Test Credentials (No Real Personal Data)
- **Organizer:** `organizer@campus.edu` / `password123`
- **Student 1:** `student1@campus.edu` / `password123`
- **Student 2:** `student2@campus.edu` / `password123`

## API Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/api/register` | Public | Register a new student account |
| POST | `/api/login` | Public | Login and receive Bearer token |
| GET | `/api/events` | Public | List published events (`?search=` & `?category=`) |
| GET | `/api/events/{id}` | Public | View event details & remaining seats |
| GET | `/api/my-registrations` | Student | View own registrations & statuses |
| POST | `/api/events/{id}/register` | Student | Register or join waitlist (with row locking) |
| POST | `/api/registrations/{id}/cancel` | Student | Cancel before deadline & auto-promote waitlist |
| GET | `/api/organizer/events` | Organizer | List all events |
| POST | `/api/events` | Organizer | Create new event |
| PUT | `/api/events/{id}` | Organizer | Update, publish, or close event |
| GET | `/api/events/{id}/registrations` | Organizer | View student list for an event |
| PATCH | `/api/registrations/{id}/status` | Organizer | Approve or reject student registration |
| POST | `/api/events/{id}/attendance` | Organizer | Mark student attendance |

## Running Automated Tests
    cd backend
    php artisan test
