import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify, decode } from "hono/jwt";
import { string } from "zod";
import { createBlogInput } from "@man0j/medium-common";

type Variables = {
  userId: string
}
export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL:string,
        JWT_SECRET: string
    }, 
    Variables : Variables   
}>();

blogRouter.use('/*', async (c, next) => {
    const token = c.req.header("Authorization") || "";
    const header = token?.split(" ")[1];
    try {
    const user = await verify(header, c.env.JWT_SECRET);
    const decodedId = String(user.id);
    if (user) {
        c.set("userId", decodedId);
        await next();
    } else {
        c.status(411);
        return c.json({
            msg: "You are not logged in"
        })
    }
   }catch (e) {
    c.status(403);
    return c.json({
        msg: "invalid token"
    })
   }
})

blogRouter.post('/post', async (c) => {
   const body = await c.req.json();
   const userId = c.get("userId");
   const prisma = new PrismaClient({
     datasourceUrl: c.env.DATABASE_URL,
   }).$extends(withAccelerate())

   const blog = await prisma.blog.create({
    data : {
        title: body.title,
        content: body.content,
        authorId: Number(userId)
    }
   })
   return c.json({
    id: blog.id
   })
})
  
blogRouter.put('/update', async (c) => {
    const body = await c.req.json();
    const userId = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
    const blog = await prisma.blog.update({
        where: {
            id: body.id,
            authorId: Number(userId)
        }, 
        data: {
            title: body.title,
            content: body.content
        }
     })
     console.log(blog)
     return c.json({
        msg: "success"
     })
    } catch (e) {
        console.log(e);
        return c.json({
            msg: "update unsuccessfull"
        })
    }
})


blogRouter.get('/bulk', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const blogs = await prisma.blog.findMany();
    return c.json({
        blogs
    })
    
})


blogRouter.get('/:id', async(c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const blog = await prisma.blog.findFirst({
            where: {
                id: Number(id)
            }
        })
        return c.json({
            blog
        })
    } catch (e) {
        c.status(411);
        return c.json({
            msg: "blog not found"
        })
    }
})
  
