<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Categories
        $orientation = EventCategory::create(['name' => 'Orientation']);
        $workshops = EventCategory::create(['name' => 'Workshops']);
        $clubs = EventCategory::create(['name' => 'Clubs & Social']);

        // 2. Create Test Accounts (No real personal data)
        $organizer = User::create([
            'name' => 'Campus Coordinator',
            'email' => 'organizer@campus.edu',
            'password' => 'password123',
            'role' => 'organizer',
            'student_year' => 4,
        ]);

        User::create([
            'name' => 'First Year Student A',
            'email' => 'student1@campus.edu',
            'password' => 'password123',
            'role' => 'student',
            'student_year' => 1,
        ]);

        User::create([
            'name' => 'First Year Student B',
            'email' => 'student2@campus.edu',
            'password' => 'password123',
            'role' => 'student',
            'student_year' => 1,
        ]);

        // 3. Create Sample Events
        Event::create([
            'category_id' => $orientation->id,
            'organizer_id' => $organizer->id,
            'title' => 'First-Year Campus Welcome & Tour',
            'description' => 'Guided tour of the library, labs, and student center for incoming freshmen.',
            'location' => 'Main Quad Auditorium',
            'event_date' => now()->addDays(5),
            'registration_deadline' => now()->addDays(4),
            'cancellation_deadline' => now()->addDays(3),
            'capacity' => 2, // Small capacity so you can easily test the waitlist!
            'requires_approval' => true,
            'status' => 'published',
        ]);

        Event::create([
            'category_id' => $workshops->id,
            'organizer_id' => $organizer->id,
            'title' => 'Intro to Git & Web Development',
            'description' => 'Hands-on coding workshop for first-year computer science students.',
            'location' => 'Tech Building Room 204',
            'event_date' => now()->addDays(7),
            'registration_deadline' => now()->addDays(6),
            'cancellation_deadline' => now()->addDays(5),
            'capacity' => 25,
            'requires_approval' => false,
            'status' => 'published',
        ]);

        Event::create([
            'category_id' => $clubs->id,
            'organizer_id' => $organizer->id,
            'title' => 'Freshman Club & Society Fair',
            'description' => 'Meet 30+ student clubs and sign up for campus activities.',
            'location' => 'Student Union Hall',
            'event_date' => now()->addDays(10),
            'registration_deadline' => now()->addDays(9),
            'cancellation_deadline' => now()->addDays(8),
            'capacity' => 50,
            'requires_approval' => true,
            'status' => 'published',
        ]);
    }
}