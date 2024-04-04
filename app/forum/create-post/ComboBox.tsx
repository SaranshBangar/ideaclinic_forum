"use client"


import { Calendar, Check, ChevronsUpDown, MoreHorizontal, Tag, Tags, Trash, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"

const frameworks = [
  {
    "value": "Help Required",
    "label": "Help Required",
    "color": "#FFCC00",
},
{
    "value": "New Idea",
    "label": "New Idea",
    "color": "#007BFF",
},
{
    "value": "Looking for Team",
    "label": "Looking for Team",
    "color": "#4CAF50",
},
{
    "value": "Needs Feedback",
    "label": "Needs Feedback",
    "color": "#FF9800",
},
{
    "value": "Discussion",
    "label": "Discussion",
    "color": "#333333",
},
{
    "value": "Resource Sharing",
    "label": "Resource Sharing",
    "color": "#4285F4",
},
{
    "value": "Question",
    "label": "Question",
    "color": "#C776FF",
},
{
    "value": "Tutorial",
    "label": "Tutorial",
    "color": "#9D38BD",
},
{
    "value": "Success Story",
    "label": "Success Story",
    "color": "#28A745",
},
{
    "value": "Open Ended Discussion",
    "label": "Open Ended Discussion",
    "color": "#FFA500",
},
{
    "value": "Professor Input Needed",
    "label": "Professor Input Needed",
    "color": "#9933CC",
},
{
    "value": "Student Project",
    "label": "Student Project",
    "color": "#FFD700",
},
{
    "value": "Other",
    "label": "Other",
    "color": "#CCCCCC",
},
]
   

export function ComboboxDropdownMenu({
  label , setLabel, color, setColor
} : {
  label: string
  setLabel:  React.Dispatch<React.SetStateAction<string>>
  color: string
  setColor:  React.Dispatch<React.SetStateAction<string>>
}) {
    // const [label, setLabel] = useState("Other")
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    // const [color, setColor] = useState("#CCCCCC")
    // console.log(color)

    function badgeRender(){
      return(
        <Badge variant='secondary' className={`px-2 py-1 mx-2 flex flex-row gap-1 bg-[${color}] hover:bg-[${color}] text-nowrap text-white`}><Tag />{label}</Badge>
      )
    }
    useEffect(()=>{
      badgeRender()
    },[color])

  return (
    <div className="flex w-full flex-1 flex-row justify-center rounded-md px-4  items-center">
      {badgeRender()}
      <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-[#090909] text-white"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select a label..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 z-[1000] bg-[#090909] text-white">
        <Command className="z-[10000] bg-[#090909] text-white">
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                    {frameworks.map((framework) => (
                    <CommandItem
                        key={framework.value}
                        value={framework.value}
                        className="text-white"
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue)
                          setLabel(currentValue === value ? "" : currentValue)
                          setColor(currentValue === value ? "#FFCC00" : framework.color)
                          setOpen(false)
                        }}
                    >
                        <Check
                        className={cn(
                            "mr-2 h-4 w-4",
                            value === framework.value ? "opacity-100" : "opacity-0"
                        )}
                        />
                        {framework.label}
                    </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    </div>
  )
}
