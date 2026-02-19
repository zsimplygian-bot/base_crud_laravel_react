import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import SmartDateTimePicker from "@/components/ui/datetimepicker"
import { FieldFile } from "@/components/form/field-file"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export const FormField=({
  id,label,type="text",value,disabled,placeholder,
  options=[],loading,open,setOpen,onChange,onSelect,
  setData,view,hidden,width,
}:any)=>{
  const base={id,disabled,placeholder}
  const isCheckbox=type==="checkbox"
  const widthClass=width==="1/2"?"w-1/2":width==="1/3"?"w-1/3":width==="1/4"?"w-1/4":"w-full"

  return(
    <div className={`relative ${hidden?"hidden":""} ${widthClass}`}>
      {!hidden&&label&&!isCheckbox&&(
        <Label {...{htmlFor:id,className:"absolute -top-3 left-2 px-1 bg-background text-sm z-10"}}>
          {label}
        </Label>
      )}

      {type==="combobox"&&<Combobox {...{...base,value,options,loading,open,setOpen,onSelect}} />}
      {["date","time","datetime"].includes(type)&&<SmartDateTimePicker {...{type,value,onChange,disabled}} />}
      {type==="file"&&<FieldFile {...{id,value,setData,disabled,view}} />}
      {type==="textarea"&&<Textarea {...{...base,value,onChange}} />}

      {isCheckbox&&(
        <div className="flex items-center gap-2 pt-0">
          <Checkbox {...{checked:Boolean(value),disabled,onCheckedChange:v=>onChange(Boolean(v))}} />
          <Label {...{htmlFor:id}}>{label}</Label>
        </div>
      )}

      {!["combobox","date","time","datetime","file","textarea","checkbox"].includes(type)&&
        <Input {...{...base,type,value,onChange}} />}
    </div>
  )
}
