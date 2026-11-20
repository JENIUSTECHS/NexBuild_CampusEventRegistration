<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\EventCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventRegistrationTest extends TestCase
{
    use RefreshDatabase;

    private function createSampleEvent($capacity = 2, $requiresApproval = false)
    {
        $organizer = User::create([
            'name' => 'Organizer',
            'email' => 'org@test.edu',
            'password' => 'password123',
            'role' => 'organizer',
            'student_year' => 4,
        ]);

        $category = EventCategory::create(['name' => 'Orientation']);

        return Event::create([
            'category_id' => $category->id,
            'organizer_id' => $organizer->id,
            'title' => 'Campus Tour',
            'description' => 'First year tour',
            'location' => 'Main Hall',
            'event_date' => now()->addDays(5),
            'registration_deadline' => now()->addDays(4),
            'cancellation_deadline' => now()->addDays(3),
            'capacity' => $capacity,
            'requires_approval' => $requiresApproval,
            'status' => 'published',
        ]);
    }

    public function test_prevents_duplicate_registration(): void
    {
        $event = $this->createSampleEvent(5);
        $student = User::create([
            'name' => 'Student One',
            'email' => 's1@test.edu',
            'password' => 'password123',
            'role' => 'student',
            'student_year' => 1,
        ]);

        $this->actingAs($student)->postJson("/api/events/{$event->id}/register")
            ->assertStatus(201);

        $this->actingAs($student)->postJson("/api/events/{$event->id}/register")
            ->assertStatus(400);
    }

    public function test_puts_student_on_waitlist_when_capacity_is_full(): void
    {
        $event = $this->createSampleEvent(1, false);
        $student1 = User::create([
            'name' => 'Student One',
            'email' => 's1@test.edu',
            'password' => 'password123',
            'role' => 'student',
            'student_year' => 1,
        ]);
        $student2 = User::create([
            'name' => 'Student Two',
            'email' => 's2@test.edu',
            'password' => 'password123',
            'role' => 'student',
            'student_year' => 1,
        ]);

        $this->actingAs($student1)->postJson("/api/events/{$event->id}/register")
            ->assertJsonPath('registration.status', 'approved');

        $this->actingAs($student2)->postJson("/api/events/{$event->id}/register")
            ->assertJsonPath('registration.status', 'waitlisted');
    }

    public function test_student_cannot_access_organizer_endpoints(): void
    {
        $student = User::create([
            'name' => 'Student One',
            'email' => 's1@test.edu',
            'password' => 'password123',
            'role' => 'student',
            'student_year' => 1,
        ]);

        $this->actingAs($student)->postJson('/api/events', [
            'title' => 'Unauthorized Event',
        ])->assertStatus(403);
    }
}