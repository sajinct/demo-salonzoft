export function validateReleaseTarget(environment, projectRef, expectedRef) {
  if (!["staging", "production"].includes(environment))
    throw new Error("Explicit staging or production environment required.");
  if (!/^[a-z]{20}$/.test(projectRef ?? "") || projectRef !== expectedRef)
    throw new Error(
      "Explicit project reference must match the protected environment’s SUPABASE_PROJECT_REF.",
    );
  return { environment, projectRef };
}
