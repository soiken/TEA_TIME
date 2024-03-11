import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import prisma from '../lib/prisma';
import Post, { PostProps } from '../components/Post';
import React from 'react';
import Layout from '../components/Layout';
import { getServerSession } from "next-auth/next"
import { authHandler } from './api/auth/[...nextauth]';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getServerSession(req, res, authHandler);

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
    const { data: session } = useSession();

    if (!session) {
        return (
            <Layout>
                <h1>My Drafts</h1>
                <div>You need to be authenticated to view this page.</div>
            </Layout>
        );
    };

    return (
        <Layout>
            <div className='page'>
                <h1>My Drafts</h1>
                <main>
                    {props.drafts.map((post) => (
                        <div className='post' key={post.id}>
                            <Post post={post} />
                        </div>
                    ))}
                </main>
            </div>
            <style jsx>{`
                .post {
                    background: var(--geist-background);
                    border: 1px dotted var(--highlight);
                    transition: box-shadow 0.1s ease-in;
                }
                .post:hover {
                    border: none;
                    box-shadow: 1px 1px 3px var(--highlight);
                    cursor: pointer;
                }
                .post + .post {
                    margin-top: 2rem;
                }
            `}</style>
        </Layout>
    );
};

export default Drafts;