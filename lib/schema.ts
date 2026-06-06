import { z } from "zod"

export const BetFormSchema = z
    .object({
        guessDeaths: z.number().int().min(0).max(1000),
        // Hearts & time only exist if the dragon is killed, so failure-predicters
        // skip both: optional here, required only when guessIsFailing is false.
        // Viewer inputs 0-10 in half-heart steps; stored as int 0-20.
        guessHearts: z
            .number()
            .min(0, "0-10 hearts")
            .max(10, "0-10 hearts")
            .multipleOf(0.5, "half hearts only")
            .transform((v) => v * 2)
            .optional(),
        hours: z.number().int().min(0).max(11).optional(),
        minutes: z.number().int().min(0).max(59).optional(),
        seconds: z.number().int().min(0).max(59).optional(),
        guessIsFailing: z.boolean(),
    })
    .superRefine((data, ctx) => {
        if (data.guessIsFailing) return
        for (const field of ["guessHearts", "hours", "minutes", "seconds"] as const) {
            if (data[field] === undefined) {
                ctx.addIssue({
                    code: "custom",
                    path: [field],
                    message: "required",
                })
            }
        }
    })
export type BetFormSchemaType = z.infer<typeof BetFormSchema>
