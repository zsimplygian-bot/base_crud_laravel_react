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
        Schema::create('cliente', function (Blueprint $table) {
            $table->integer('id_cliente', true);
            $table->string('cliente');
            $table->string('dni', 8);
            $table->string('email', 100)->nullable();
            $table->string('telefono', 9)->nullable();
            $table->string('direccion')->nullable();
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
        Schema::dropIfExists('cliente');
    }
};
