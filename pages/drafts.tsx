//pages/drafts.tsx
import React from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import { useSession, getSession } from "next-auth/react";
import prisma from "../lib/prisma";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const drafts = await prisma.post.findMany({
    where: {
      author: { email: session.user.email },
      published: false,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { drafts },
  };
};

type Props = {
  drafts: PostProps[];
};

const Drafts: React.FC<Props> = (props) => {
  const {data: session} = useSession();

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Drafts</h1>
        <main>
          {props.drafts.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .page {
          max-width: 800px;
          margin: auto;
          padding: 2rem;
        }

        h1 {
          font-size: 28px;
          color: #333;
          margin-bottom: 2rem;
        }

        .post {
          background: #f9f9f9;
          padding: 2rem;
          margin-bottom: 2rem;
          border-radius: 10px;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .post:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        main {
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 768px) {
          .page {
            padding: 1rem;
          }
          .post {
            padding: 1rem;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Drafts;
