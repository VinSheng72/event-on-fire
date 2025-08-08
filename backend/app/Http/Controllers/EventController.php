<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use App\Services\EventService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    protected EventService $events;

    public function __construct(EventService $events)
    {
        $this->events = $events;
    }

    public function index(Request $request)
    {
        $keyword = $request->query('search');
        $events  = $this->events->all($keyword);
        return response()->json(['data' => $events,], Response::HTTP_OK);
    }

    public function show(Request $request, $event)
    {

        $user = Auth::guard('sanctum')->user();
        return $this->events->find($event, $user->id ?? null);
    }

    public function store(StoreEventRequest $request)
    {
        return $this->events->create($request->validated());
    }

    public function update(UpdateEventRequest $request, Event $event)
    {
        $updated =  $this->events->update($event->id, $request->validated());
        return response()->json([
            'message' => config('messages.event_updated'),
            'data'    => $updated,
        ], Response::HTTP_OK);
    }

    public function destroy(Event $event)
    {
        $this->events->delete($event->id);
        return response()->json(['message' => config('messages.event_deleted')], Response::HTTP_OK);
    }

    public function popular()
    {
        $list = $this->events->getPopular();
        return response()->json(['data' => $list], Response::HTTP_OK);
    }

    public function upcoming()
    {
        $list = $this->events->getUpcoming();
        return response()->json(['data' => $list], Response::HTTP_OK);
    }

    public function register(Event $event)
    {
        return $this->events->register($event);
    }
}
