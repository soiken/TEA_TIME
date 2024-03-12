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
      <img
        src="../images/bg.jpg"
        alt="Food Banner"
        style={{
          width: "100%",
          borderRadius: "10px",
          marginTop: "2rem",
        }}
      />
    </div>
  );
};

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <Banner />
        <main className="container">
          <h2 style={{ textAlign: "center", margin: "2rem 0" }}>Public Feed</h2>
          <div className="posts">
            {props.feed.map((post) => (
              <div key={post.id} className="post">
                <Post post={post} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Blog;
