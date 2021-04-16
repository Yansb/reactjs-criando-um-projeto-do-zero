import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <div>
      <img src={post.data.banner} alt={post.data.title} />
      <h1>{post.data.title}</h1>
      <div>
        <span>{post.first_publication_date}</span>
        <span>{post.data.author}</span>
        <span>4min</span>
        {post.data.content.map(content => (
          <div>
            <h3>{content.heading}</h3>
            {content.body.map(body => (
              <p>{body.text}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { slug: 'conteudo-aqui' } }],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', String(slug), {});

  const post: Post = {
    data: {
      author: response.data.author,
      banner: response.data.banner,
      title: response.data.title,
      content: response.data.content,
    },
    first_publication_date: new Date(
      response.last_publication_date
    ).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  };

  return { props: { post } };
};
