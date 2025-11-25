import {z} from "zod";

export const accpetMessageSchema = z.object({
    accpetMessages: z.boolean()
})