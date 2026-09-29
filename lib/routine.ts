export type SkinFeel = "dry" | "balanced" | "oily";
export type Preference = "essential" | "extended";
export type Priority = "hydration" | "tone" | "texture";
export type RoutineAnswers = { feel:SkinFeel; preference:Preference; priority:Priority };
export type RoutineStep = { id:string; reason:string; optional?:boolean };
export function buildRoutine({feel,preference,priority}:RoutineAnswers):RoutineStep[] {
  const steps:RoutineStep[] = [{id:"cleanser",reason:"A clean, comfortable starting point for every routine."}];
  if(preference === "extended") steps.push(priority === "tone"
    ? {id:"even",reason:"Chosen for your interest in a more even-looking tone."}
    : {id:"dew",reason:priority === "hydration" ? "Adds a hydrating-feeling layer." : "Adds a light layer before your final cream step."});
  steps.push({id:"moisturizer",reason:"A simple final moisture step that can be adjusted to the amount you like."});
  if(preference === "extended" && feel === "dry") steps.push({id:"mask",reason:"An optional richer final step for evenings when skin feels tight.",optional:true});
  return steps;
}
