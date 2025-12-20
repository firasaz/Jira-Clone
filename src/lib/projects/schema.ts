import z from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  // "image" will be a type of file in the form when uploading,
  // and a URL string when fetching the data from the db, thus the "z.union"
  image: z
    .union([
      z.instanceof(File),
      z.string().transform(value => (value === "" ? undefined : value)),
    ])
    .optional(),
  workspaceId: z.string(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Minimum 1 character required").optional(),
  // "image" will be a type of file in the form when uploading,
  // and a URL string when fetching the data from the db, thus the "z.union"
  image: z
    .union([
      z.instanceof(File),
      z.string().transform(value => (value === "" ? undefined : value)),
    ])
    .optional(),
});
