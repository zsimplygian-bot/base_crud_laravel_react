<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
class Motivo extends BaseModel
{
    use HasFactory;
    protected $table = 'motivo';
    protected static $validationRules = [
        'motivo' => 'required|string|max:100',
        'emoji_motivo' => 'nullable|string|max:100',
    ];
    protected static $tableColumns = [
        ['ID','id'],
        ['MOTIVO','motivo'],
        ['EMOJI','emoji_motivo'],
    ];
    public static function getQuery(): array
    {
        $t1 = (new self)->getTable();
        return [
            'alias' => $t1,
            'query' => DB::table($t1)->select([
                "$t1.id_$t1 as id",
                "$t1.motivo",
                "$t1.emoji_motivo",
            ]),
        ];
    }
}
