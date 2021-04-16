import { GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import Link from 'next/link';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  return (
    <div className={styles.container}>
      {postsPagination.results.map(post => (
        <Link key={post.uid} href={`/post/${post.uid}`}>
          <div className={styles.card}>
            <h1>{post.data.title}</h1>
            <h3>{post.data.subtitle}</h3>
            <div className={styles.footer}>
              <span>
                <img src="/images/calendar.svg" alt="calendar" />
                {post.first_publication_date}
              </span>
              <span>
                <img src="/images/user.svg" alt="user" /> {post.data.author}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const pageSize = 10;
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 100,
    }
  );

  const next_page = Math.ceil(postsResponse.results.length / pageSize);
  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,

      first_publication_date: new Date(
        post.last_publication_date
      ).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        results,
        next_page,
      },
    },
  };
};
