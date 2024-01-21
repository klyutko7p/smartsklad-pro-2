import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    id: number;
}


export default defineEventHandler(async (event) => {
    try {
        const { id } = await readBody<IRequestBody>(event);

        const deleteOrderAccount = await prisma.orderAccount.delete({
            where: {
                id: id,
            },
        })

    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});
