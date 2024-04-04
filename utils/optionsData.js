import moment from "moment";

export const months = [
  { value: "January", label: "January" },
  { value: "February", label: "February" },
  { value: "March", label: "March" },
  { value: "April", label: "April" },
  { value: "May", label: "May" },
  { value: "June", label: "June" },
  { value: "July", label: "July" },
  { value: "August", label: "August" },
  { value: "September", label: "September" },
  { value: "October", label: "October" },
  { value: "November", label: "November" },
  { value: "December", label: "December" },
];

export const cities = [
  { value: "DH", label: "DH" },
  { value: "RT", label: "RT" },
  { value: "ABQ", label: "ABQ" },
  { value: "Mub", label: "Mub" },
  { value: "Jed", label: "Jed" },
  { value: "Riy", label: "Riy" },
  { value: "Yanb", label: "Yanb" },
];

const currentYear = moment().subtract(1, "year").year();
export const years = Array.from({ length: 10 }, (_, i) => currentYear - i).map(
  (el) => {
    return {
      value: `${el}`,
      label: `${el}`,
    };
  }
);
