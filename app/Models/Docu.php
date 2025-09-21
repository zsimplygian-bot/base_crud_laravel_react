<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Docu extends Model
{
    protected $table = 'docu';
    protected $primaryKey = 'id_docu';
    public $timestamps = false; // si tu tabla no tiene created_at/updated_at
}