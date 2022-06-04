<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            // for sign in
            $table->string('email')->unique();
            $table->string('password');
            $table->rememberToken();
            // request
            $table->string('full_name',50);
            $table->date('started_date');
            $table->date('end_date');
            $table->enum('status', ['new', 'active', 'inactive'])->default('new');
            $table->enum('role', ['admin', 'employees'])->default('employees');
            // data for employees
            $table->enum('sex',['male', 'female', 'other']);
            $table->date('date_birth')->nullable();
            $table->tinyInteger('amount_work')->default(0);
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
        Schema::dropIfExists('users');
    }
}
