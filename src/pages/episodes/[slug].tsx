import { GetStaticPaths, GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import ptBR from 'date-fns/locale/pt-BR';
import style from './episode.module.scss';

import { api } from '../../services/Api';

import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { useContext } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import { GlobalContext } from '../../contexts/GlobalContext';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  url: string;
  durationTime: number;
  duration: number;
}

type EpisodeProps = {
  episode: Episode;
}

export default function Episodes({ episode }: EpisodeProps) {
  const { playSlugEpisode } = useContext(PlayerContext);
  const { themeDark } = useContext(GlobalContext);
  
  return (
    <div className={themeDark == true ? style.homePageDark : style.homePage}>
      <Head>
        <title>{episode.title}</title>
      </Head>
      <div className={style.episode}>
          <div className={style.thumbnailContainer}>
            <Link href='/'>
              <button type='button'>
                <img src='/arrow-left.svg' alt='Voltar'/>
              </button>
            </Link>
            <Image 
              width={700}
              height={160}
              src={episode.thumbnail}
              objectFit='cover'
            />
            <button type='button' onClick={() => playSlugEpisode(episode)}>
              <img src='/play.svg' alt='Tocar Episódio'/>
            </button>
          </div>

          <header>
            <h1>{episode.title}</h1>
            <span>{episode.members}</span>
            <span>{episode.publishedAt}</span>
            <span>{episode.duration}</span>
          </header>

          <div className={style.description}  dangerouslySetInnerHTML={{ __html: episode.description }} />
        </div>
    </div>
    
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc',
    }
  });

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id,
      }
    };
  })

  return{
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (ctx) =>  {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
      id: data.id,
      title: data.title,
      members: data.members,
      publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
      thumbnail: data.thumbnail,
      description: data.description,
      url: data.file.url,
      duration: convertDurationToTimeString(Number(data.file.duration)),
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24,
  }
}