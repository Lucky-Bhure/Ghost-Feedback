import {z} from "zod";

export const accpetMessageSchema = z.object({
    acceptMessages: z.boolean()
})