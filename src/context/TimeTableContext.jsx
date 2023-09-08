import { createContext } from "react";

let initialValue = {
    classes: {
      161: {className: 161, short: '161short'},
      162: {className: 162, short: '162short'},
      163: {className: 163, short: '163short'},
    },
    timeTable: {
      nameOfSchool: "161",
      year: "2023/2024",
      registrationName: "161r",
      periodsPerDay: 3,
      numberOfDays: 2,
      weekend: "Saturday - Sunday",
   }
};

export const TimeTableContext = createContext(initialValue);
