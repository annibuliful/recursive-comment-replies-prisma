import { Prisma, PrismaClient } from '@prisma/client';
const prismaClient = new PrismaClient();

// optional this is used when you want to run clean up all records in all tables
async function cleanupDB() {
  const tablenames = await prismaClient.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      try {
        const result = await prismaClient.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
        );
        console.log(`cleanup table = ${tablename}`, result);
      } catch (error) {
        console.log('clean up error => ', error);
      }
    }
  }
}

const USER_A_AUTH_ID = 'mock_authId_a';
const USER_B_AUTH_ID = 'mock_authId_b';

async function createMockUser() {
  const userA: Prisma.UserUncheckedCreateInput = {
    id: 1,
    authId: USER_A_AUTH_ID,
    email: 'mock_email_a',
    username: 'mock_username_a',
  };

  const userB: Prisma.UserUncheckedCreateInput = {
    id: 2,
    authId: USER_B_AUTH_ID,
    email: 'mock_email_b',
    username: 'mock_username_b',
  };

  const resultA = await prismaClient.user.upsert({
    where: {
      id: 2,
    },
    update: {},
    create: userA,
  });

  const resultB = await prismaClient.user.upsert({
    where: {
      id: 2,
    },
    update: {},
    create: userB,
  });

  console.log('created user info', { resultB, resultA });
}

async function createMockComment() {
  const comment: Prisma.CommentUncheckedCreateInput = {
    id: 1,
    authId: USER_A_AUTH_ID,
    content: 'mock_comment_from_user_a',
  };

  const result = await prismaClient.comment.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: comment,
  });

  console.log('created comment info', result);
}

async function createMockParentReply() {
  const parentReply: Prisma.ReplyUncheckedCreateInput = {
    id: 1,
    content: 'mock_parent_reply_from_user_a',
    authId: USER_A_AUTH_ID,
    commentId: 1,
  };

  const result = await prismaClient.reply.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: parentReply,
  });

  console.log('created parent reply info', result);
}

async function createMockChildReply() {
  const childReply: Prisma.ReplyUncheckedCreateInput = {
    id: 2,
    parentReplyId: 1, // parent reply id come from createMockParentReply()
    content: 'mock_child_reply_from_user_b',
    authId: USER_B_AUTH_ID,
    commentId: 1, // comment id come from createMockComment()
  };

  const result = await prismaClient.reply.upsert({
    where: {
      id: 2,
    },
    update: {},
    create: childReply,
  });

  console.log('created child reply info', result);
}

async function main() {
  await createMockUser();
  await createMockComment();
  await createMockParentReply();
  await createMockChildReply();
}

main();
