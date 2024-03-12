//pages/create.tsx
import React, { useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";

// Define the Banner component
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

const Draft: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content };
      await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/drafts");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      {/* Render the Banner component here */}
      <Banner />
      <div className="page">
        <form onSubmit={submitData} className="form">
          <h1>New Draft</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
            className="input"
          />
          <textarea
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            value={content}
            className="textarea"
          />
          <input disabled={!content || !title} type="submit" value="Create" className="submit" />
          <a className="back" href="#" onClick={() => Router.push("/")}>
            or Cancel
          </a>
        </form>
      </div>
    </Layout>
  );
};

export default Draft;
