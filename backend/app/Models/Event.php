<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'category_id',
        'organizer_id',
        'title',
        'description',
        'location',
        'event_date',
        'registration_deadline',
        'cancellation_deadline',
        'capacity',
        'requires_approval',
        'status',
    ];

    protected $appends = ['available_seats'];

    public function category()
    {
        return $this->belongsTo(EventCategory::class, 'category_id');
    }

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    // Automatically calculate remaining seats
    public function getAvailableSeatsAttribute()
    {
        $taken = $this->registrations()
            ->whereIn('status', ['pending_approval', 'approved'])
            ->count();

        return max(0, $this->capacity - $taken);
    }
}