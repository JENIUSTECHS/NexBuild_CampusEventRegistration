<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RegistrationController extends Controller
{
    // Student: view own registrations
    public function myRegistrations(Request $request)
    {
        $regs = EventRegistration::with('event')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($regs);
    }

    // Student: register with DB transaction + row locking to prevent overbooking
    public function register(Request $request, $eventId)
    {
        $user = $request->user();

        return DB::transaction(function () use ($eventId, $user) {
            $event = Event::where('id', $eventId)->lockForUpdate()->firstOrFail();

            if ($event->status !== 'published' || now()->greaterThan($event->registration_deadline)) {
                return response()->json(['message' => 'Registration is closed for this event.'], 400);
            }

            $existing = EventRegistration::where('event_id', $event->id)
                ->where('user_id', $user->id)
                ->whereIn('status', ['pending_approval', 'approved', 'waitlisted'])
                ->first();

            if ($existing) {
                return response()->json(['message' => 'You already have an active registration.'], 400);
            }

            $takenSeats = EventRegistration::where('event_id', $event->id)
                ->whereIn('status', ['pending_approval', 'approved'])
                ->count();

            if ($takenSeats < $event->capacity) {
                $status = $event->requires_approval ? 'pending_approval' : 'approved';
            } else {
                $status = 'waitlisted';
            }

            $registration = EventRegistration::create([
                'event_id' => $event->id,
                'user_id' => $user->id,
                'status' => $status,
            ]);

            return response()->json([
                'message' => "Registration submitted! Status: {$status}",
                'registration' => $registration,
            ], 201);
        });
    }

    // Student: cancel registration and auto-promote waitlist
    public function cancel(Request $request, $registrationId)
    {
        $user = $request->user();

        return DB::transaction(function () use ($registrationId, $user) {
            $registration = EventRegistration::lockForUpdate()->findOrFail($registrationId);

            if ($registration->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            $event = Event::where('id', $registration->event_id)->lockForUpdate()->first();

            if (now()->greaterThan($event->cancellation_deadline)) {
                return response()->json(['message' => 'Cancellation window has passed.'], 400);
            }

            $oldStatus = $registration->status;
            $registration->update(['status' => 'cancelled']);

            if (in_array($oldStatus, ['pending_approval', 'approved'])) {
                $nextInLine = EventRegistration::where('event_id', $event->id)
                    ->where('status', 'waitlisted')
                    ->orderBy('created_at', 'asc')
                    ->first();

                if ($nextInLine) {
                    $nextInLine->update([
                        'status' => $event->requires_approval ? 'pending_approval' : 'approved',
                    ]);
                }
            }

            return response()->json(['message' => 'Registration cancelled successfully.']);
        });
    }

    // Organizer: approve or reject student registration
    public function updateStatus(Request $request, $registrationId)
    {
        $request->validate(['status' => 'required|in:approved,cancelled']);

        $registration = EventRegistration::findOrFail($registrationId);
        $registration->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Registration status updated.',
            'registration' => $registration,
        ]);
    }
}