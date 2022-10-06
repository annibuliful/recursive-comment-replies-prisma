import util from 'util';
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

async function main() {
  const commentWithNestedReplies =
    await prismaClient.comment.findUnique({
      where: {
        id: 1,
      },
      include: {
        replies: {
          include: {
            replies: true,
          },
        },
      },
    });

  console.log(
    util.inspect(commentWithNestedReplies, {
      showHidden: false,
      depth: null,
      colors: true,
    })
  );
}

main();
