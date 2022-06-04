<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (User::user()->role === 'admin') {
            return User::all();
        } else return ['status' => 'error', 'message' => 'Request login role admin'];
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
            if (User::where('email', $request->email)->count() > 0)
                return ['status' => 'error', 'message' => 'The Email was registered'];
            $user = new User();
            $user->email = $request->email;
            $user->password = bcrypt($request->password);
            $user->full_name = $request->full_name;
            $user->started_date = $request->started_date;
            $user->end_date = $request->end_date;
            $user->sex = $request->sex;
            $user->date_birth = $request->date_birth;
            return $user->save() ?
                ['status' => 'sucess', 'message' => 'Successful user creation'] :
                ['status' => 'error', 'message' => 'Server system error'];
        } else return ['status' => 'error', 'message' => 'Request login role admin'];
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        if ($user === null) {
            return ['status' => 'error', 'message' => 'Email is not registered'];
        } elseif (!Hash::check($request->password, $user->password)) {
            return ['status' => 'error', 'message' => 'Incorrect password'];
        } elseif( $user->status === 'inactive' ){
            return ['status' => 'error', 'message' => 'Account has been locked'];
        } else {
            $user->remember_token = Str::random(100);
            if($user->status === 'new') $user->status = 'active';
            return $user->save() ? ['status' => 'success', 'data' => $user] : ['status' => 'error', 'message' => 'Server system error'];
        }
    }
    public function remember(Request $request)
    {
        $user = User::where('remember_token', $request->_token)->first();
        if ($user === null)
            return ['status' => 'error', 'message' => 'Requires login'];
        elseif (Carbon::now()->diffInMinutes(new Carbon($user->updated_at)) > 30) {
            $user->remember_token = null;
            $user->save();
            return ['status' => 'error', 'message' => 'Login timeout'];
        } else {
            $user->remember_token = Str::random(100);
            return $user->save() ? ['status' => 'success', 'data' => $user] : ['status' => 'error', 'message' => 'Server system error'];
        }
    }
}
