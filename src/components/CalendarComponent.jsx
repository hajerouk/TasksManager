import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarComponent({ selectedDate, onChange }) {
  return (
    <div className="calendar-wrapper">
      <Calendar
        onChange={onChange}
        value={selectedDate}
        
      />
    </div>
  );
}
