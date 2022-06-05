<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $hidden = [
        'task_for',
        'created_at',
        'updated_at'
    ];
    public function create_by()
    {
        $user = User::find($this->created_by);
        return (object)['id'=>$user->id, 'full_name' => $user->full_name, 'email' => $user->email];
    }

    public function task_format()
    {
        $now = Carbon::now();
        $start = new Carbon($this->start);
        $target = new Carbon($this->target);
         
        if( new Carbon($this->completed) > $target){
            $this->number_late = $now->diffInDays($this->target) + 1;
        }

        if($this->status === 'new' && $start < $now){
            $this->status = 'processing';
            $this->save();
        }
        if($this->status == 'processing'){
            $this->number_date = $now->diffInDays($target) + 1;
            $this->number_date_max = $target->diffInDays($start) + 1;
            $this->parent = ($this->number_date_max - $this->number_date) * 100 / $this->number_date_max;

        }
        $this->created_by = $this->create_by();
    }
}
