<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function index(Request $request)
    {
        // Tu lógica aquí
        return view('usuario.index'); // Asegúrate de que esta vista exista
    }
}