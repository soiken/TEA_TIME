import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  // Added logo display to the left navigation section
  let left = (
    <div className="left">
      <a href="/">
        <img src="../images/logo.jpg" alt="Logo" className="logo" /> {/* Logo image added */}
      </a>
      <Link href="/">
        <a className="bold" data-active={isActive("/")}>
          全部訂單
        </a>
      </Link>
      <style jsx>{`
        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: #000;
          display: inline-block;
        }

        .left a[data-active="true"] {
          color: gray;
        }

        a + a {
          margin-left: 1rem;
        }

        .logo { /* Styling for the logo */
          height: 50px; /* Example size, adjust as needed */
          margin-right: 20px; /* Adjust spacing between the logo and the link */
        }
      `}</style>
    </div>
  );

  let right = null;

  if (status === "loading") {
    right = (
      <div className="right">
        <p>Validating session ...</p>
        <style jsx>{`
          .right {
            margin-left: auto;
          }
        `}</style>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="right">
        <Link href="/api/auth/signin">
          <a data-active={isActive("/signup")}>登入</a>
        </Link>
        <style jsx>{`
          a {
            text-decoration: none;
            color: #000;
            display: inline-block;
          }

          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
          }

          .right a {
            border: 1px solid black;
            padding: 0.5rem 1rem;
            border-radius: 3px;
          }
        `}</style>
      </div>
    );
  }

  if (session) {
    left = (
      <div className="left">
        <a href="/">
          <img src="../images/logo.jpg" alt="Logo" className="logo" /> {/* Ensure logo appears in all states */}
        </a>
        <Link href="/">
          <a className="bold" data-active={isActive("/")}>
            全部訂單
          </a>
        </Link>
        <Link href="/drafts">
          <a data-active={isActive("/drafts")}>我的草稿</a>
        </Link>
        <style jsx>{`
          .bold {
            font-weight: bold;
          }

          a {
            text-decoration: none;
            color: #000;
            display: inline-block;
          }

          .left a[data-active="true"] {
            color: gray;
          }

          a + a {
            margin-left: 1rem;
          }

          .logo {
            height: 50px;
            margin-right: 20px;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        <p>
          {session.user.name} ({session.user.email})
        </p>
        <Link href="/create">
          <a>
          <button>落新訂單</button>
          </a>
        </Link>
          <a>
          <button onClick={() => signOut()}>登出</button>
          </a>
        <style jsx>{`
          a {
            text-decoration: none;
            color: #000;
            display: inline-block;
          }

          p {
            display: inline-block;
            font-size: 13px;
            padding-right: 1rem;
          }

          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
          }

          .right a {
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 3px;
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
        `}</style>
      </div>
    );
  }

  return (
    <nav>
      {left}
      {right}
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
        }
      `}</style>
    </nav>
  );
};

export default Header;
