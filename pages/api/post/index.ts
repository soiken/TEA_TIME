import { getSession } from "next-auth/react";
import { authHandler } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
interface Session {
  user?: {
      email?: string,
  }
}

export default async function handle(req: any, res: any) {
  const { title, content } = req.body;

  const session: Session = await getServerSession(req, res, authHandler);
  if (!session || !session.user.email) {
      res.status(401).json({ error: 'You must be logged in to create a post.' });
      return;
  }

  const result = await prisma.post.create({
      data: {
          title: title,
          content: content,
          author: { connect: { email: session?.user?.email } },
      },
  });
  res.json(result);
}