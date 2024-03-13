import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  let left = (
    <div className="left">
      <a href="/">
        <img src="../images/logo.jpg" alt="Logo" className="logo" />
      </a>
      <Link href="/">
        <a className="bold" data-active={isActive("/")}>
          全部訂單
        </a>
      </Link>
    </div>
  );

  let right = null;

  if (status === "loading") {
    right = (
      <div className="right">
        <p>Validating session ...</p>
      </div>
    );
  } else if (!session) {
    right = (
      <div className="right">
        <Link href="/api/auth/signin">
          <a data-active={isActive("/signup")}>登入</a>
        </Link>
      </div>
    );
  } else {
    left = (
      <div className="left">
        <a href="/">
          <img src="../images/logo.jpg" alt="Logo" className="logo" />
        </a>
        <Link href="/">
          <a className="bold" data-active={isActive("/")}>
            全部訂單
          </a>
        </Link>
        <Link href="/drafts">
          <a data-active={isActive("/drafts")}>我的草稿</a>
        </Link>
      </div>
    );
    right = (
      <div className="right">
        <p>
          {session.user.name} ({session.user.email})
        </p>
        <Link href="/create">
          <button>
            <a>落新訂單</a>
          </button>
        </Link>
        <button onClick={() => signOut()}>
          <a>登出</a>
        </button>
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
          flex-wrap: wrap;
          padding: 1rem;
          align-items: center;
          justify-content: space-between;
        }

        .left, .right {
          display: flex;
          align-items: center;
        }

        a, p {
          text-decoration: none;
          color: #000;
          display: inline-block;
          margin: 0 0.5rem;
        }

        .bold {
          font-weight: bold;
        }

        .logo {
          height: 40px;
          margin-right: 20px;
        }

        @media (max-width: 600px) {
          nav {
            padding: 0.5rem;
          }

          .logo {
            height: 30px;
          }

          a, p {
            font-size: 14px;
          }

          .right p, .right a {
            display: none; // Hide text to simplify interface on small screens
          }

          .right button {
            padding: 0.25rem 0.5rem; // Smaller buttons on mobile
          }
        }
      `}</style>
    </nav>
  );
};

export default Header;
