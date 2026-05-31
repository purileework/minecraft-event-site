import { z } from "zod"

export const BetFormSchema = z.object({
    guessDeaths: z.number().int().min(0).max(30),
    guessHearts: z.number().int().min(0).max(20),
    hours: z.number().int().min(0).max(23),
    minutes: z.number().int().min(0).max(59),
    seconds: z.number().int().min(0).max(59),
})
export type BetFormSchemaType = z.infer<typeof BetFormSchema>
