<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use Mockery;
use App\Models\Event;
use App\Models\Registration;
use App\Services\EventService;
use Illuminate\Support\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Repositories\EventRepositoryInterface;
use App\Repositories\UserRepositoryInterface;
use App\Repositories\RegistrationRepositoryInterface;

class EventServiceTest extends TestCase
{
    protected $event;
    protected $user;
    protected $register;
    protected $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->event = Mockery::mock(EventRepositoryInterface::class);
        $this->user = Mockery::mock(UserRepositoryInterface::class);
        $this->register = Mockery::mock(RegistrationRepositoryInterface::class);

        $this->service = new EventService(
            $this->event,
            $this->user,
            $this->register
        );
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function testAllEvents()
    {
        $events = new Collection([new Event()]);
        $this->event
            ->shouldReceive('all')
            ->once()
            ->andReturn($events);;
        $result = $this->service->all(null);
        $this->assertSame($events, $result);
    }

    public function testAllEventsWithSearch()
    {
        $search = 'foo';
        $events = new Collection([new Event()]);
        $this->event
            ->shouldReceive('search')
            ->once()
            ->with($search)
            ->andReturn($events);

        $result = $this->service->all($search);

        $this->assertSame($events, $result);
    }

    public function testUserRegister()
    {
        $userId  = 1;
        $eventId = 2;
        $this->register
            ->shouldReceive('hasUserRegistration')
            ->once()
            ->with($userId, $eventId)
            ->andReturn(true);

        $this->assertTrue($this->service->hasUserRegistration($userId, $eventId));
    }

    public function testEvents()
    {
        $eventId = 5;
        $event   = new Event();
        $this->event
            ->shouldReceive('find')
            ->once()
            ->with($eventId)
            ->andReturn($event);

        $result = $this->service->find($eventId, null);

        $this->assertEquals([
            'event'         => $event,
            'is_registered' => false,
        ], $result);
    }

    public function testEventsWithLogin()
    {
        $eventId = 5;
        $userId  = 9;
        $event   = new Event();
        $this->event
            ->shouldReceive('find')
            ->once()
            ->with($eventId)
            ->andReturn($event);
        $this->register
            ->shouldReceive('hasUserRegistration')
            ->once()
            ->with($userId, $eventId)
            ->andReturn(true);

        $result = $this->service->find($eventId, $userId);

        $this->assertEquals([
            'event'         => $event,
            'is_registered' => true,
        ], $result);
    }

    public function testCreateEvents()
    {
        $data  = ['title' => 'My Event'];
        $event = new Event();
        $this->event
            ->shouldReceive('create')
            ->once()
            ->with($data)
            ->andReturn($event);

        $this->assertSame($event, $this->service->create($data));
    }

    public function testUpdateEvents()
    {
        $id    = 7;
        $data  = ['title' => 'Updated'];
        $event = new Event();
        $this->event
            ->shouldReceive('update')
            ->once()
            ->with($id, $data)
            ->andReturn($event);

        $this->assertSame($event, $this->service->update($id, $data));
    }

    public function testDeleteEvent()
    {
        $id = 7;
        $this->event
            ->shouldReceive('delete')
            ->once()
            ->with($id)
            ->andReturn(true);

        $this->assertTrue($this->service->delete($id));
    }

    public function testGetPopularEvent()
    {
        $collection = new Collection();
        $this->event
            ->shouldReceive('getPopular')
            ->once()
            ->with(4)
            ->andReturn($collection);

        $this->assertSame($collection, $this->service->getPopular());
    }

    public function testGetUpcomingEvent()
    {
        $collection = new Collection();
        $this->event
            ->shouldReceive('getUpcoming')
            ->once()
            ->with(10)
            ->andReturn($collection);

        $this->assertSame($collection, $this->service->getUpcoming());
    }

    public function testFailRegisterEvent()
    {
        $userId = 3;
        $event  = new Event();
        $event->id = 11;

        Auth::shouldReceive('user')
            ->once()
            ->andReturn((object)['id' => $userId]);

        $this->register
            ->shouldReceive('hasUserRegistration')
            ->once()
            ->with($userId, $event->id)
            ->andReturn(true);

        $response = $this->service->register($event);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(409, $response->status());
        $this->assertEquals(['message' => 'Already registered'], $response->getData(true));
    }

    public function testRegisterEvent()
    {
        $userId = 4;
        $event  = new Event();
        $event->id = 22;

        Auth::shouldReceive('user')
            ->once()
            ->andReturn((object)['id' => $userId]);

        $this->register
            ->shouldReceive('hasUserRegistration')
            ->once()
            ->with($userId, $event->id)
            ->andReturn(false);

        $registration = new Registration(['user_id' => $userId, 'event_id' => $event->id]);    
        $this->register
            ->shouldReceive('create')
            ->once()
            ->with($userId, $event->id)
            ->andReturn($registration);

        $response = $this->service->register($event);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->status());
        $this->assertEquals(['message' => 'Success'], $response->getData(true));
    }
}
