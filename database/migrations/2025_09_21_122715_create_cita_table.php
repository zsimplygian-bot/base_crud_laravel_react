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
        Schema::create('cita', function (Blueprint $table) {
            $table->integer('id_cita', true);
            $table->integer('id_mascota')->index('id_mascota');
            $table->date('fecha');
            $table->time('hora');
            $table->integer('id_motivo_cita')->nullable();
            $table->integer('id_estado_cita')->nullable();
            $table->integer('creater_id');
            $table->dateTime('created_at');
            $table->integer('updater_id')->nullable();
            $table->dateTime('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cita');
    }
};
