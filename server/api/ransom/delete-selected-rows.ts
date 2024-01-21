import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    idArray: number[];
    flag: string;
}


export default defineEventHandler(async (event) => {
    try {
        const { idArray, flag } = await readBody<IRequestBody>(event);

        if (flag === 'OurRansom') {
            const deleteRows = await prisma.ourRansom.deleteMany({
                where: {
                    id: {
                        in: idArray,
                    },
                },
            })
        } else if (flag === 'ClientRansom') {
            const deleteRows = await prisma.clientRansom.deleteMany({
                where: {
                    id: {
                        in: idArray,
                    },
                },
            })
        }

       
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return { error: error.message };
        }
    }

});
