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
        Schema::create('mascota', function (Blueprint $table) {
            $table->integer('id_mascota', true);
            $table->string('mascota');
            $table->integer('id_cliente')->index('id_cliente');
            $table->string('especie', 100);
            $table->string('raza', 100)->nullable();
            $table->integer('id_sexo')->nullable();
            $table->integer('edad')->nullable();
            $table->string('color', 100)->nullable();
            $table->decimal('peso', 5)->nullable();
            $table->string('imagen')->nullable();
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
        Schema::dropIfExists('mascota');
    }
};
