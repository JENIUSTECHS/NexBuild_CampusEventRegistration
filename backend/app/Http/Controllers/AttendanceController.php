<?php

namespace App\Http\Controllers;

use App\Models\EventAttendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function markAttendance(Request $request, $eventId)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'attended' => 'required|boolean',
        ]);

        $attendance = EventAttendance::updateOrCreate(
            ['event_id' => $eventId, 'user_id' => $data['user_id']],
            ['attended' => $data['attended']]
        );

        return response()->json(['message' => 'Attendance saved.', 'attendance' => $attendance]);
    }
}