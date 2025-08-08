<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAdminRequest;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Http\Response AS Code;

class AdminController extends Controller
{

    public function __construct(private UserRepositoryInterface $users) {}

    public function store(StoreAdminRequest $request)
    {
        $subAdmin = $this->users->createSubAdmin($request->validate());

        return response()->json(['message' => 'Sub-admin created successfully.','data'=> $subAdmin,], Code::HTTP_OK);
    }
}
