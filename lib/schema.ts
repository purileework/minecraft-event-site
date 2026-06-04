import { z } from "zod"

export const BetFormSchema = z.object({
    guessDeaths: z.number().int().min(0).max(1000),
    // Viewer inputs 0-10 in half-heart steps; stored as int 0-20.
    guessHearts: z
        .number()
        .min(0, "0-10 hearts")
        .max(10, "0-10 hearts")
        .multipleOf(0.5, "half hearts only")
        .transform((v) => v * 2),
    hours: z.number().int().min(0).max(23),
    minutes: z.number().int().min(0).max(59),
    seconds: z.number().int().min(0).max(59),
})
export type BetFormSchemaType = z.infer<typeof BetFormSchema>
