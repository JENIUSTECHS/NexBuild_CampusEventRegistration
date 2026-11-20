<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsOrganizer
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || $request->user()->role !== 'organizer') {
            return response()->json(['message' => 'Access denied. Organizers only.'], 403);
        }

        return $next($request);
    }
}