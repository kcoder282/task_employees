<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'role',
        'created_at',
        'updated_at',
        'remember_token'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    static $_user = null;

    public static function user()
    {
        if (self::$_user === null) {
            self::$_user = self::where('remember_token', $_REQUEST['_token']??'')->first()??new User();
        }
        return self::$_user;
    }

    public static function check(){
        return self::user()->id !== null;
    }

    public function get_task()
    {
        $task = Task::where('task_for', $this->id)->get();
        return $task;
    }
    
}
