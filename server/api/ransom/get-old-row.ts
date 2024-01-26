import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
  old_id: number;
  flag: string;
}

export default defineEventHandler(async (event) => {
  try {
    const { old_id, flag } = await readBody<IRequestBody>(event);

    if (flag === 'OurRansom') {
      const row = await prisma.ourRansom.findUnique({
        where: {
          old_id: old_id,
        },
      })
      return row;
    }
    // else if (flag === 'ClientRansom') {
    //   const row = await prisma.clientRansom.findUnique({
    //     where: {
    //       id: id,
    //     },
    //   })
    //   return row;
    // } else if (flag === 'Delivery') {
    //   const row = await prisma.delivery.findUnique({
    //     where: {
    //       id: id,
    //     },
    //   })
    //   return row;
    // } 

  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      return { error: error.message };
    }
  }

});
