<?php

namespace App\Http\Controllers;

use App\Repositories\EventRepositoryInterface;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserEventController extends Controller
{

    protected UserService $user;

    public function __construct(UserService $user) {
        $this->user = $user;
    }


    public function index()
    {
        return $this->user->getUserEvent();
        
    }
}
