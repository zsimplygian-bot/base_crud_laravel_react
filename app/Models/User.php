<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Support\Facades\DB;
use App\Models\Traits\HasCrudModel;
class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable, HasCrudModel;
    protected $table = 'user';
    protected $primaryKey = 'id_user';
    public $incrementing = true;
    protected $keyType = 'int';
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    protected static $validationRules = [
        'name'     => 'required|string|max:255',
        'email'    => 'required|email',
        'id_rol'   => 'required|integer',
        'password' => 'nullable|string|min:8',
    ];
    protected static $tableColumns = [
        ['ID', 'id'],
        ['NOMBRE', 'name'],
        ['EMAIL', 'email'],
        ['ROL', 'rol'],
        ['FECHA REGISTRO', 'created_at'],
    ];
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable();
        $t2 = 'rol';
        return [
            'alias' => $t1,
            'query' => DB::table($t1)
                ->leftJoin($t2, "$t1.id_$t2", '=', "$t2.id_$t2")
                ->select([
                    "$t1.id_user as id",
                    "$t1.name",
                    "$t2.rol",
                    "$t1.email",
                    "$t1.created_at",
                ]),
        ];
    }
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol');
    }
}