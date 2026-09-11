import { User, Users } from "lucide-react";
const personalInfo = {
  icon: User,
  title: "Personal information",
  items: [
    { dt: "Date of birth", dd: "03/04/2000" },
    { dt: "Gender", dd: "Female" },
    { dt: "Blood group", dd: "O+" },
    { dt: "Admission date", dd: "18/08/2023" },
    { dt: "Previous school", dd: "Bethel High School" },
    { dt: "Address", dd: "Tuek Tla, Phnom Penh" },
  ],
};

const guardianInfo = {
  icon: Users,
  title: "Guardian information",
  items: [
    { dt: "Guardian name", dd: "Robert Rose" },
    { dt: "Relationship", dd: "Father" },
    { dt: "Phone", dd: "+123 123 1234" },
    { dt: "Email", dd: "student@gmail.com" },
    { dt: "Occupation", dd: "Software Engineer" },
    { dt: "Emergency contact", dd: "+123 123 123" },
  ],
};

export const overviews = [personalInfo, guardianInfo];
