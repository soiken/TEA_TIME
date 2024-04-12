//pages/index.tsx
import React from "react";
import type { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { feed },
    revalidate: 10,
  };
};

type Props = {
  feed: PostProps[];
};

const Banner = () => {
  return (
    <div className="banner">
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>落單神器</h1>
      <p style={{ fontSize: "1.2rem" }}>馬上落單</p>
      {/* Add high-quality images of available food items here */}
      <a href="../images/bg.jpg" target="_blank" rel="noopener noreferrer">
      <img
        src="../images/bg.jpg"
        alt="Food Banner"
        style={{
          width: "100%",
          borderRadius: "10px",
          marginTop: "2rem",
          cursor: "pointer", // Add cursor pointer to indicate clickability
        }}
      />
    </a>
    </div>
  );
};

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <Banner />
        <main className="container">
          <h2 style={{ textAlign: "center", margin: "2rem 0" }}>全部訂單</h2>
          <div className="posts">
            {props.feed.map((post) => (
              <div key={post.id} className="post">
                <Post post={post} />
              </div>
            ))}
          </div>
        </main>
      </div>
      <style jsx>{`
        .page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .banner {
          background-color: #f8f8f8;
          padding: 40px;
          border-radius: 10px;
          margin-bottom: 20px;
          text-align: center;
        }

        .container {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .posts {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          width: 100%;
        }

        .post {
          background: #f8f8f8;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
          width: calc(33.33% - 20px);
          margin-bottom: 20px;
        }

        .post:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .post {
            width: calc(50% - 20px);
          }
        }

        @media (max-width: 480px) {
          .post {
            width: calc(100% - 20px);
          }
        }
      `}</style>
    </Layout>
  );
};

export default Blog;
