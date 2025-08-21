"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const CalenderComp = () => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="border text-[#344054] border-gray rounded-[6px] w-48 flex items-center py-[10px] px-3 justify-between font-normal">
          {date ? date.toLocaleDateString() : "Select Date Range"}

          <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
            <path
              d="M15 1L8 8L1 1"
              stroke="#344054"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0 bg-white border border-border-gray"
        align="start"
      >
        <Calendar
          mode="single"
          defaultMonth={date}
          numberOfMonths={2}
          selected={date}
          captionLayout="dropdown"
          onSelect={(date) => {
            setDate(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CalenderComp;
