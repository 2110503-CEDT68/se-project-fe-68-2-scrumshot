'use client'
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

export default function DateReserve({ 
    value, 
    onDateChange 
}: { 
    value?: Dayjs | null,
    onDateChange: (value: Dayjs | null) => void 
}) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
                className="bg-white" 
                value={value || null}
                onChange={(newValue) => onDateChange(newValue)}
            />
        </LocalizationProvider>
    );
}