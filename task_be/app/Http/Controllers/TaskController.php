<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $l_task = Task::where('task_for', User::user()->id)->orderBy('created_at', 'DESC')->orderBy('status')->get();
        foreach ($l_task as $task) {
            $task->task_format();
        }
        return $l_task;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (User::user()->role === 'admin') {
            $task = new Task();
            $task->task_name = $request->task_name;
            $task->task_content = $request->task_content;
            $task->start = $request->start;
            $task->target = $request->target;
            $task->created_by = User::user()->id;
            $task->task_for = $request->task_for;
            return $task->save() ?
                ['status' => 'success', 'message' => 'Added a task for employees successfully'] :
                ['status' => 'error', 'message' => 'Server system error'];
        } else return ['status' => 'error', 'message' => 'Request login role admin'];
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if (User::check()) {
            $task = Task::find($id);
            if ($task) {
                if($request->status === 'complete'){
                    if(Carbon::now() < new Carbon($task->start) ) 
                    return ['status' => 'error', 'message' => 'The task has not yet started'];
                    else {
                        $task->status = 'complete';
                        return $task->save() ?
                        ['status' => 'success', 'message' => 'Confirmation completed'] :
                        ['status' => 'error', 'message' => 'Server system error'];
                    }
                }
                if($request->status === 'received'){
                    if($task->status !== 'new') return ['status' => 'error', 'message' => 'Not a new task'];
                    else {
                        $task->status = 'received';
                        return $task->save() ?
                        ['status' => 'success', 'message' => 'Confirm task received successfully'] :
                        ['status' => 'error', 'message' => 'Server system error'];
                    }
                }
                return ['status' => 'error', 'message' => 'The status only accepts the values "complete" and "received'];
            } else return ['status' => 'error', 'message' => 'Task does not exist'];
        } else return  ['status' => 'error', 'message' => 'Request login'];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy(Task $task)
    {
        //
    }
}
