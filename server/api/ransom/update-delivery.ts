import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    row: IOurRansom | IClientRansom;
    flag: string;
    flagRansom: string;
}


export default defineEventHandler(async (event) => {
    try {
        const { row, flag, flagRansom } = await readBody<IRequestBody>(event);

        let updateField;

        switch (flag) {
            case 'SC':
                updateField = 'deliveredSC';
                break;
            case 'PVZ':
                updateField = 'deliveredPVZ';
                break;
            case 'issued':
                updateField = 'issued';
                break;
            default:
                throw new Error(`Unsupported flag: ${flag}`);
        }

        if (flagRansom === 'OurRansom') {
            const updateRow = await prisma.ourRansom.update({
                where: {
                    id: row.id,
                },
                data: {
                    [updateField]: new Date(),
                },
            });
        } else if (flagRansom === 'ClientRansom') {
            const updateRow = await prisma.clientRansom.update({
                where: {
                    id: row.id,
                },
                data: {
                    [updateField]: new Date(),
                },
            });
        }

       
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }
});

