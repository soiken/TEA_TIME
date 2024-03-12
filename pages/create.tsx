//pages/create.tsx
import React, { useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";

// Define the Banner component
const Banner = () => {
  return (
    <div className="banner">
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
          <h1>草稿</h1>
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
          <input disabled={!content || !title} type="submit" value="送出" className="submit" />
          <a className="back" href="#" onClick={() => Router.push("/")}>
            或取消
          </a>
        </form>
      </div>
      <style jsx>{`
        // Styles for Banner
        .banner {
          text-align: center;
          padding: 2rem 0;
          background: #f0f0f5;
          margin-bottom: 3rem;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        // Existing styles...
        .page {
          background: #fafafa;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .form {
          width: 100%;
          max-width: 500px;
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        h1 {
          font-size: 24px;
          color: #333;
        }

        .input, .textarea {
          width: 100%;
          padding: 0.75rem;
          margin: 0.5rem 0 1rem 0;
          border-radius: 8px;
          border: 1px solid #ddd;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
          transition: border-color 0.3s ease;
        }

        .input:focus, .textarea:focus {
          border-color: #007aff;
          outline: none;
        }

        .submit {
          background: #007aff;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .submit:not(:disabled):hover {
          background: #005ecb;
        }

        .back {
          display: inline-block;
          margin-top: 1rem;
          color: #007aff;
          text-decoration: none;
          font-size: 16px;
        }

        .back:hover {
          text-decoration: underline;
        }
      `}</style>
    </Layout>
  );
};

export default Draft;
