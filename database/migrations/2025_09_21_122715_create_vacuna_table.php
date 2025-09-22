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
        Schema::create('vacuna', function (Blueprint $table) {
            $table->integer('id_vacuna', true);
            $table->integer('id_mascota')->index('id_mascota');
            $table->string('nombre');
            $table->date('fecha_aplicacion');
            $table->date('proxima_dosis')->nullable();
            $table->text('observaciones')->nullable();
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
        Schema::dropIfExists('vacuna');
    }
};
