<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Broadcasting\InteractsWithSockets;

class NotificationBroadcast implements ShouldBroadcast
{
    use InteractsWithSockets;

    public string $message;

    public function __construct(string $message = 'Hello from Reverb!')
    {
        $this->message = $message;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('notification');
    }

    public function broadcastWith(): array
    {
        return ['message' => $this->message];
    }
}