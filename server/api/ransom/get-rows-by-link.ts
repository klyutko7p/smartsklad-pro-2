import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    link: string;
    flag: string;
}

export default defineEventHandler(async (event) => {
    try {
        const { link, flag } = await readBody<IRequestBody>(event);

        if (flag === 'OurRansom') {
            const rows = await prisma.ourRansom.findMany({
                where: {
                    clientLink1: link,
                },
                orderBy: {
                    id: 'asc'
                }
            });
            return rows;
        } else {
            const rows = await prisma.clientRansom.findMany({
                where: {
                    clientLink2: link,
                },
                orderBy: {
                    id: 'asc'
                }
            });
            return rows;
        }

    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});
