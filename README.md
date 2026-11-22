PS C:\Users\muham\campus-events> git add README.md
fatal: pathspec 'README.md' did not match any files
PS C:\Users\muham\campus-events> @'
>> # UniFirst Events – Campus Event Registration Platform
>> 
>> A full-stack campus event registration system built for first-year university students with approval-based workflows, seat locking, waitlists, and an organizer dashboard.
>> 
>> ## Tech Stack
>> - **Frontend:** React (Vite), React Router, Axios, CSS3
>> - **Backend:** PHP 8.3, Laravel, Laravel Sanctum
>> - **Database:** MySQL
>>
>> ## Setup Instructions
>>
>> ### 1. Backend Setup
>> ```bash
>> cd backend
>> composer install
>> cp .env.example .env
>> # Configure DB_DATABASE=campus_events, DB_USERNAME=root, DB_PASSWORD= in .env
>> php artisan key:generate
>> php artisan migrate --seed
>> php artisan serve
>> ^C
PS C:\Users\muham\campus-events> # UniFirst Events – Campus Event Registration Platform
>>
>> A full-stack campus event registration system built for first-year university students with approval-based workflows, seat locking, waitlists, and an organizer dashboard.
>>
>> ## Tech Stack
>> - **Frontend:** React (Vite), React Router, Axios, CSS3
>> - **Backend:** PHP 8.3, Laravel, Laravel Sanctum
>> - **Database:** MySQL
>>
>> ## Setup Instructions
>>
>> ### 1. Backend Setup
>>     cd backend
>>     composer install
>>     cp .env.example .env
>>     # Configure DB_DATABASE=campus_events, DB_USERNAME=root, DB_PASSWORD= in .env
>>     php artisan key:generate
>>     php artisan migrate --seed
>>     php artisan serve
>>
>> ### 2. Frontend Setup
>>     cd frontend
>>     npm install
>>     npm run dev
>>
>> ## Test Credentials (No Real Personal Data)
>> - **Organizer:** `organizer@campus.edu` / `password123`
>> - **Student 1:** `student1@campus.edu` / `password123`
>> - **Student 2:** `student2@campus.edu` / `password123`
>>
>> ## API Endpoints
>> | Method | Endpoint | Access | Description |
>> | :--- | :--- | :--- | :--- |
>> | POST | `/api/register` | Public | Register a new student account |
>> | POST | `/api/login` | Public | Login and receive Bearer token |   
>> | GET | `/api/events` | Public | List published events (`?search=` &
 `?category=`) |
>> | GET | `/api/events/{id}` | Public | View event details & remaining
 seats |
>> | GET | `/api/my-registrations` | Student | View own registrations &
 statuses |
>> | POST | `/api/events/{id}/register` | Student | Register or join waitlist (with row locking) |
>> | POST | `/api/registrations/{id}/cancel` | Student | Cancel beforedeadline & auto-promote waitlist |
>> | GET | `/api/organizer/events` | Organizer | List all events |     
>> | POST | `/api/events` | Organizer | Create new event |
>> | PUT | `/api/events/{id}` | Organizer | Update, publish, or close event |
>> | GET | `/api/events/{id}/registrations` | Organizer | View studentlist for an event |
>> | PATCH | `/api/registrations/{id}/status` | Organizer | Approve orreject student registration |
>> | POST | `/api/events/{id}/attendance` | Organizer | Mark student attendance |
>>
>> ## Running Automated Tests
>>     cd backend
>>     php artisan test
At line:6 char:2
+ - **Frontend:** React (Vite), React Router, Axios, CSS3
+  ~
Missing expression after unary operator '-'.
At line:6 char:4
+ - **Frontend:** React (Vite), React Router, Axios, CSS3
+    ~
You must provide a value expression following the '*' operator.        
At line:6 char:5
+ - **Frontend:** React (Vite), React Router, Axios, CSS3
+     ~
You must provide a value expression following the '*' operator.        
At line:6 char:5
+ - **Frontend:** React (Vite), React Router, Axios, CSS3
+     ~~~~~~~~~~~
Unexpected token 'Frontend:**' in expression or statement.
At line:7 char:2
+ - **Backend:** PHP 8.3, Laravel, Laravel Sanctum
+  ~
Missing expression after unary operator '-'.
At line:7 char:4
+ - **Backend:** PHP 8.3, Laravel, Laravel Sanctum
+    ~
You must provide a value expression following the '*' operator.        
At line:7 char:5
+ - **Backend:** PHP 8.3, Laravel, Laravel Sanctum
+     ~
You must provide a value expression following the '*' operator.        
At line:7 char:5
+ - **Backend:** PHP 8.3, Laravel, Laravel Sanctum
+     ~~~~~~~~~~
Unexpected token 'Backend:**' in expression or statement.
At line:8 char:2
+ - **Database:** MySQL
+  ~
Missing expression after unary operator '-'.
At line:8 char:4
+ - **Database:** MySQL
+    ~
You must provide a value expression following the '*' operator.        
Not all parse errors were reported.  Correct the reported errors and   
try again.
    + CategoryInfo          : ParserError: (:) [], ParentContainsErro  
   rRecordException
    + FullyQualifiedErrorId : MissingExpressionAfterOperator

PS C:\Users\muham\campus-events> 
