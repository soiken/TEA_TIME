import React from "react";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import Router from "next/router";
import { PostProps } from "../../components/Post";
import { useSession } from "next-auth/react";
import prisma from "../../lib/prisma";

// Server-side data fetching
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return {
    props: post,
  };
};

// Publishing function
async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: "PUT",
  });
  await Router.push("/");
}

// Deleting function
async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: "DELETE",
  });
  Router.push("/");
}

const Post: React.FC<PostProps> = (props) => {
  const {data: session, status} = useSession();
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <div className="post">
        <h2>{title}</h2>
        <p>By {props?.author?.name || "Unknown author"}</p>
        <ReactMarkdown children={props.content} />
        <div className="actions">
          {!props.published && userHasValidSession && postBelongsToUser && (
            <button className="publishButton" onClick={() => publishPost(props.id)}>Publish</button>
          )}
          {userHasValidSession && postBelongsToUser && (
            <button className="deleteButton" onClick={() => deletePost(props.id)}>Delete</button>
          )}
        </div>
      </div>
      <style jsx>{`
        .post {
          background: #ffffff;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          color: #333;
          line-height: 1.6;
        }

        h2 {
          color: #000;
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        p {
          font-size: 1rem;
          color: #666;
        }

        .actions {
          margin-top: 2rem;
          display: flex;
          justify-content: start;
        }

        button {
          border: 1px solid #ccc;
          background-color: #fff;
          color: #333;
          border-radius: 0.375rem;
          padding: 0.65rem 1.5rem;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
          font-weight: 600;
        }

        button:hover {
          border-color: #333;
          color: #fff;
          background-color: #333;
        }

        .publishButton {
          margin-right: 1rem;
        }

        .deleteButton {
          border-color: #999;
        }

        .deleteButton:hover {
          background-color: #999;
        }
      `}</style>
    </Layout>
  );
};

export default Post;
