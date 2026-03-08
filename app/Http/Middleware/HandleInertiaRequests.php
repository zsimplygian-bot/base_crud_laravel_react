<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\User;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user()
            ? User::with('rol')->find($request->user()->id_user)
            : null;

        return [
            ...parent::share($request),

            'auth' => [
                'user' => $user
                    ? [
                        'id'     => $user->id_user,
                        'name'   => $user->name,
                        'email'  => $user->email,
                        'rol'    => $user->rol?->rol,
                        'id_rol' => $user->id_rol,
                        'avatar' => $user->archivo
                            ? asset('storage/' . $user->archivo)
                            : null,
                    ]
                    : null,
            ],

            'sidebarOpen' => $request->cookie('sidebar_state') === 'true',

            // 🔥 SOLO AGREGAMOS record_id (success ya viene solo)
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'record_id' => fn() => $request->session()->get('record_id'),
            ],
        ];
    }
}