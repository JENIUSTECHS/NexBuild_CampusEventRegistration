<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('event_categories')->onDelete('cascade');
            $table->foreignId('organizer_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('location');
            $table->dateTime('event_date');
            $table->dateTime('registration_deadline');
            $table->dateTime('cancellation_deadline');
            $table->integer('capacity');
            $table->boolean('requires_approval')->default(true);
            $table->enum('status', ['draft', 'published', 'closed'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};