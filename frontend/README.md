# UniFirst Events – Campus Event Registration Platform

A full-stack campus event registration system built for first-year university students with approval-based workflows, seat locking, waitlists, and an organizer dashboard.

## Tech Stack
- **Frontend:** React (Vite), React Router, Axios, CSS3
- **Backend:** PHP 8.3, Laravel, Laravel Sanctum
- **Database:** MySQL

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
# Configure DB_DATABASE=campus_events, DB_USERNAME=root, DB_PASSWORD= in .env
php artisan key:generate
php artisan migrate --seed
php artisan serve