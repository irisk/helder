import type { SchoolConfig } from "../types";
import { voorbeeldbasisschool } from "./voorbeeldbasisschool";
import { voorbeeldcollege } from "./voorbeeldcollege";

/* ⚠️ Alleen verzonnen scholen. Deze site is statisch: alles wat hier staat, is door
   iedereen te lezen, ook achter een moeilijke link. Echte schooldata hoort niet in
   deze repo. */
const SCHOLEN: SchoolConfig[] = [voorbeeldcollege, voorbeeldbasisschool];

export const schoolMetId = (id?: string) => SCHOLEN.find((s) => s.id === (id ?? voorbeeldcollege.id));
