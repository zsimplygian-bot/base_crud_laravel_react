<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('consulta', function (Blueprint $table) {
            $table->foreign(['id_mascota'], 'consulta_ibfk_1')->references(['id_mascota'])->on('mascota')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consulta', function (Blueprint $table) {
            $table->dropForeign('consulta_ibfk_1');
        });
    }
};
