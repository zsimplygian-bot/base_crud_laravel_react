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
        Schema::table('vacuna', function (Blueprint $table) {
            $table->foreign(['id_mascota'], 'vacuna_ibfk_1')->references(['id_mascota'])->on('mascota')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vacuna', function (Blueprint $table) {
            $table->dropForeign('vacuna_ibfk_1');
        });
    }
};
