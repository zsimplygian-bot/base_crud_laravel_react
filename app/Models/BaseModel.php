<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Traits\HasCrudModel;
abstract class BaseModel extends Model
{
    use HasFactory, HasCrudModel;
    public $incrementing = true;
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->primaryKey = 'id_' . $this->getTable(); // PK automática
    }
}