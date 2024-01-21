import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});
