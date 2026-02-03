import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { partnerCinemas } from "@/lib/cinemasData";
import CinemaCard from "./cinema-card";
import { useUIContext } from "@/lib/ui-context";

const SelectCinema = () => {
  const {selectedCinema, setSelectedCinema} = useUIContext()
  const cinema = partnerCinemas.find((c) => c.id === selectedCinema);
  console.log("partnerCinemas", partnerCinemas)
  return (
    <div className="md:min-w-72 w-full ">
      <Select
      
        value={selectedCinema}
        onValueChange={(value) => setSelectedCinema(value)}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Select a cinema" />
        </SelectTrigger>
        <SelectContent>
          {partnerCinemas.map((cinema, idx) => (
            <SelectItem key={cinema.id} value={cinema.id}>
              {cinema.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* {selectedCinema && (
        <p className="mt-2 text-sm text-gray-700">
          Selected Cinema: {selectedCinema}
        </p>
      )} */}
      {cinema && <CinemaCard cinema={cinema} />}
    </div>
  );
};

export default SelectCinema;
