<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventAttendance;
use Illuminate\Http\Request;

class EventController extends Controller
{
    // Public event listing with search and category filters
    public function index(Request $request)
    {
        $query = Event::with('category')->where('status', 'published');

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        return response()->json($query->orderBy('event_date', 'asc')->get());
    }

    // Single event details
    public function show($id)
    {
        $event = Event::with('category')->findOrFail($id);
        return response()->json($event);
    }

    // Organizer: list all events
    public function organizerEvents()
    {
        return response()->json(Event::with('category')->orderBy('created_at', 'desc')->get());
    }

    // Organizer: create new event
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:event_categories,id',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'event_date' => 'required|date',
            'registration_deadline' => 'required|date',
            'cancellation_deadline' => 'required|date',
            'capacity' => 'required|integer|min:1',
            'requires_approval' => 'boolean',
            'status' => 'in:draft,published,closed',
        ]);

        $data['organizer_id'] = $request->user()->id;
        $event = Event::create($data);

        return response()->json($event, 201);
    }

    // Organizer: update/publish/close event
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string|max:255',
            'capacity' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:draft,published,closed',
        ]);

        $event->update($data);
        return response()->json($event);
    }

    // Organizer: view students registered for an event
    public function eventRegistrations($id)
    {
        $event = Event::findOrFail($id);
        $registrations = $event->registrations()->with('user')->get();

        // Attach attendance flag for each student
        foreach ($registrations as $reg) {
            $att = EventAttendance::where('event_id', $id)
                ->where('user_id', $reg->user_id)
                ->first();
            $reg->attended = $att ? (bool) $att->attended : false;
        }

        return response()->json($registrations);
    }
}