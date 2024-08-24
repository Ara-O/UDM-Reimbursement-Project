export function getOrgNumber(department) {
  const departments = {
    "Dean's Office": "0301",
    Biology: "0302",
    Math: "0303",
    Physics: "0304",
    "Chemistry and Biochemistry": "0305",
    "Pre-Health": "0306",
    "Civil Engineering": "0307",
    "Electrical Engineering": "0308",
    "Mechanical Engineering": "0309",
    Computing: "0313",
    "Professional Engineering": "0318",
    "Computer Science": "0320",
  };

  return departments[department];
}
