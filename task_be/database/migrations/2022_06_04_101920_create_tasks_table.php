<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('task_name');
            $table->string('task_content');
            $table->date('start');
            $table->date('target');
            $table->date('completed')->nullable();  
            $table->enum('status', ['new', 'received', 'processing', 'complete'])->default('new');
            $table->foreignId('created_by')->on('users')->cascadeOnDelete();
            $table->foreignId('task_for')->on('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasks');
    }
}
