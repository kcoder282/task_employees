<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        $user = new User();
        $user->email = 'ucduc20@gmail.com';
        $user->password = bcrypt('1');
        $user->full_name = 'Trần Thanh Khan';
        $user->started_date = '2022-06-10';
        $user->end_date = '2070-06-10';
        $user->sex = 'male';
        $user->date_birth = '2000-03-25';
        $user->role = 'admin';
        $user->save();
    }
}
