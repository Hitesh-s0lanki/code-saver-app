import { z } from "zod";

export const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }).max(50, {
        message: "Username should be less than 50 characters.",
    }),
    description: z.string().max(100, {
        message: "description should be not more than 100 characters.",
    }),
    language: z.string().min(1),
    input: z.boolean(),
    example: z.string(),
})

export type formSchemaType = z.infer<typeof formSchema>
