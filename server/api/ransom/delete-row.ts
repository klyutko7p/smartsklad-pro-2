import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    id: number;
    flag: string;
}


export default defineEventHandler(async (event) => {
    try {
        const { id, flag } = await readBody<IRequestBody>(event);

        if (flag === 'OurRansom') {
            const deleteRow = await prisma.ourRansom.delete({
                where: {
                    id: id,
                },
            })
        } else if (flag === 'ClientRansom') {
            const deleteRow = await prisma.clientRansom.delete({
                where: {
                    id: id,
                },
            })
        }

       
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});
