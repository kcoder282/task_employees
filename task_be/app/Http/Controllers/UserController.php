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
        } else return [];
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
            $user->started_date = new Carbon($request->started_date);
            $user->end_date = new Carbon($request->end_date);
            $user->sex = $request->sex;
            $user->date_birth = new Carbon($request->date_birth);
            return $user->save() ?
                ['status' => 'success', 'message' => 'Successful user creation'] :
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
        if (User::user()->role === 'admin') {
            return User::find($id) ?? (object)[];
        } else return [];
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
        if (User::user()->role === 'admin') {
            if (User::where('email', $request->email)->count() > 1)
                return ['status' => 'error', 'message' => 'The Email was registered'];
            $user = User::find($id);
            if($user){
                $user->email = $request->email;
                if ($request->password){
                   $user->password = bcrypt($request->password);
                }
                $user->full_name = $request->full_name;
                $user->started_date = new Carbon($request->started_date);
                $user->end_date = new Carbon($request->end_date);
                $user->sex = $request->sex;
                $user->date_birth = new Carbon($request->date_birth);
                return $user->save() ?
                    ['status' => 'success', 'message' => 'User update successfully'] :
                    ['status' => 'error', 'message' => 'Server system error'];
            } else return ['status' => 'error', 'message' => 'User does not exist'];
        } else return ['status' => 'error', 'message' => 'Request login role admin'];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id){
        if (User::user()->role === 'admin') {
            $user = User::find($id);
            if($user !== null){
                if($user->id !== User::user()->id)
                    return $user->delete()?
                    ['status' => 'success', 'message' => 'Removed user successfully'] :
                    ['status' => 'error', 'message' => 'Server system error'];
                else return ['status' => 'error', 'message' => 'Cannot remove user is active'];
            } else return ['status' => 'error', 'message' => 'User does not exist'];
        }else return ['status' => 'error', 'message' => 'Request login role admin'];
    }
    public function Update_myAuth(Request $request)
    {
        if(User::user()){
            $user = User::user();
            if($request->password_old){
                if (Hash::check($request->password_old, $user->password)) {
                    $user->password = $request->password;
                } else return ['status' => 'error', 'message' => 'Incorrect password'];
            }
            $user->full_name = $request->full_name;
            $user->started_date = new Carbon($request->started_date);
            $user->end_date = new Carbon($request->end_date);
            $user->sex = $request->sex;
            $user->date_birth = new Carbon($request->date_birth);
            return $user->save() ? ['status' => 'success', 'message' => 'User update successfully'] : ['status' => 'error', 'message' => 'Server system error'];
        }else return ['status'=>'error', 'message'=>'Request login'];
    }
    public function login(Request $request){
        $user = User::where('email', $request->email)->first();
        if ($user === null) {
            return ['status' => 'error', 'message' => 'Email is not registered'];
        } elseif (!Hash::check($request->password, $user->password)) {
            return ['status' => 'error', 'message' => 'Incorrect password'];
        } elseif( $user->status === 'inactive' ){
            return ['status' => 'error', 'message' => 'Locked user'];
        } elseif( $user->status === 'inactive' ){
            return ['status' => 'error', 'message' => 'Account has been locked'];
        } else {
            $user->remember_token = Str::random(100);
            if($user->status === 'new') $user->status = 'active';
            $result = $user->save();
            $user->_token = $user->remember_token;
            return $result ? ['status' => 'success', 'data' => $user] : ['status' => 'error', 'message' => 'Server system error'];
        }
    }
    public function remember(Request $request){
        $user = User::where('remember_token', $request->_token)->first();
        if ($user === null)
            return ['status' => 'error', 'message' => 'Requires login'];
        elseif ( $user->status === 'inactive' ) return ['status' => 'error', 'message' => 'Locked user'];
        elseif (Carbon::now()->diffInMinutes(new Carbon($user->updated_at)) > 30) {
            $user->remember_token = null;
            $user->save();
            return ['status' => 'error', 'message' => 'Login timeout'];
        } else {
            $user->remember_token = Str::random(100);
            $result = $user->save();
            $user->_token = $user->remember_token;
            return $result ? ['status' => 'success', 'data' => $user ] : ['status' => 'error', 'message' => 'Server system error'];
        }
    }
    public function change_status($id){
        if (User::user()->role === 'admin') {
            $user = User::find($id);
            if($user !== null){
                if($user->id !== User::user()->id){
                    if($user->status === 'inactive') 
                        $user->status = 'active';
                    else 
                        $user->status = 'inactive'; 
                    return $user->save()?
                    ['status' => 'success', 'message' => $user->status === 'inactive'? 'User lock':'User unlock'] :
                    ['status' => 'error', 'message' => 'Server system error'];
                }else return ['status' => 'error', 'message' => 'Unable to lock active user'];
            } else return ['status' => 'error', 'message' => 'User does not exist'];
        }else return ['status' => 'error', 'message' => 'Request login role admin'];
    }
    public function change_role($id)
    {
        if (User::user()->role === 'admin') {
            $user = User::find($id);
            if ($user !== null) {
                if ($user->id !== User::user()->id) {
                    if ($user->role === 'admin')
                        $user->role = 'employees';
                    else
                        $user->role = 'admin';
                    return $user->save() ?
                        ['status' => 'success', 'message' => $user->role === 'admin' ? 'User is Admin' : 'User is Employee'] :
                        ['status' => 'error', 'message' => 'Server system error'];
                } else return ['status' => 'error', 'message' => 'Unable to lock active user'];
            } else return ['status' => 'error', 'message' => 'User does not exist'];
        } else return ['status' => 'error', 'message' => 'Request login role admin'];
    }
}
