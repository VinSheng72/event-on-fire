<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected AuthService $auth;

    public function __construct(AuthService $auth)
    {
        $this->auth = $auth;
    }

    /**
     * @unauthenticated
     */
    public function register(RegisterRequest $request)
    {
        $result = $this->auth->register($request->validated());

        return response()->json([
            'user'  => new UserResource($result['user']),
            'token' => $result['token'],
        ], 201);
    }

    /**
     * @unauthenticated
     */
    public function login(LoginRequest $request)
    {

        try {
            $result = $this->auth->login($request->validated());
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->errors()['email'][0]
            ], 401);
        }

        return response()->json([
            'user'  => new UserResource($result['user']),
            'token' => $result['token'],
        ]);
    }

    public function logout(Request $request)
    {

        $this->auth->logout($request->user());
        return response()->json(['message' => 'Logged out']);
    }
}
