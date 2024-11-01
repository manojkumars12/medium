import z from "zod";

export const createBlogInput = z.object({
    username: z.string(),
    password: z.string()
})

export const updateBlogInput = z.object({
    title: z.string(),
    content: z.string(),
    id: z.number()
})

export const signupInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
})

const signipInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
})

export type createBlogInput = z.infer<typeof createBlogInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
export type SignUpInput = z.infer<typeof signupInput>;
export type SignIpInput = z.infer<typeof signipInput>;