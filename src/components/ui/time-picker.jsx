import React, { useState } from 'react';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Button } from './button';

export function TimePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');

  const handleTimeChange = () => {
    onChange(`${hour}:${minute} ${period}`);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Input
          type="text"
          value={value}
          readOnly
          placeholder="Select Time"
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex items-center p-2">
          <Input
            type="number"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            min="1"
            max="12"
            className="w-16"
          />
          <span className="mx-2">:</span>
          <Input
            type="number"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            min="0"
            max="59"
            className="w-16"
          />
          <Select onValueChange={setPeriod} value={period}>
            <SelectTrigger className="w-20 ml-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="p-2 border-t">
          <Button onClick={handleTimeChange} className="w-full">Set Time</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}