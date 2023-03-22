import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import styles from 'styles/Home.module.css';
import { purple } from '@radix-ui/colors';

import { Lightning, PencilSimple } from 'phosphor-react';
import { styled } from 'stitches.config';
import { Nothing } from 'components/Nothing';
import { ProjectCard } from 'components/ProjectCard';

import { Box } from 'styles/primitives/Box';
import { Text } from 'styles/primitives/Text';
import { VerticalBox } from 'styles/primitives/VerticalBox';

import { githubApi } from 'services/axios';
import { projects } from 'utils/projects';

interface IRepo {
  name: string;
  description: string;
  productionUrl: string;
  repositoryUrl: string;
  stars: number;
  forks: number;
}

interface ProjectProps {
  repos: IRepo[];
}

export const HoverElement = styled('div', {
  opacity: 0,
  visibility: 'hidden',
  position: 'absolute',
  padding: '$8',
  width: '100%',
  height: '100%',
  boxSizing: 'content-box',
  alignSelf: 'center',
  borderRadius: '$6',
  background: '$primaryGradientA',
  transform: 'scaleX(0.95)',
  transition: 'all 0.2s ease',
  zIndex: 0,
});

const Home: NextPage<any> = ({ repos }: ProjectProps) => {
  return (
    <>
      <Head>
        <title>Josh Westover | Homepage</title>
        <meta name='description' content='Personal Website for Josh Westover' />
        <link rel='icon' href='/assets/avatar.png' />
      </Head>
      <Box variant='page'>
        <VerticalBox>
          <Text as='h1' type='title' css={{ cursor: 'help' }}>
            Josh Westover
          </Text>
          <Image
            src='/Josh-website-photo.jpg'
            alt='Headshot of Josh Westover'
          />
          <Text type='paragraph' css={{ marginTop: '$4' }}>
            Hey! I&apos;m Josh Westover, a graduating Strategy student,
            entreprenuer, and aspiring Product Manager. Based in Utah.
          </Text>
          <Text type='paragraph' css={{ marginTop: '$4' }}>
            Interested in product, design and Web3.
          </Text>
        </VerticalBox>
        <VerticalBox as='main'>
          <Box css={{ display: 'block', marginTop: '$12' }}>
            <Text
              type='title'
              css={{
                marginBottom: '$10',
                display: 'flex',
                alignItems: 'center',
                svg: {
                  marginRight: '$2',
                  size: '$6',
                  color: '$primary',
                },
              }}
            >
              <Lightning />
              Projects
            </Text>
            {repos.length ? (
              <>
                {repos.map((repo: any) => (
                  <ProjectCard key={repo.name} repo={repo} />
                ))}
              </>
            ) : (
              <Nothing />
            )}
          </Box>
          <Text
            as='a'
            type='title'
            href='https://github.com/stellarjaycw'
            tabIndex={0}
            css={{
              position: 'relative',
              transition: '$base',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '$4',
              marginTop: '$12',
              outlineWidth: 0,
              '&:focus-visible': {
                [`& ${HoverElement}`]: {
                  outline: `2px solid ${purple.purple9}`,
                },
              },
              '&:hover': {
                [`& ${HoverElement}`]: {
                  opacity: 1,
                  transform: 'scaleX(1)',
                  visibility: 'visible',
                },
              },
            }}
          >
            See more...
            <HoverElement />
          </Text>
        </VerticalBox>
      </Box>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  let response: any = [];

  for await (const project of projects) {
    const { data }: any = await githubApi.get(`/repos/stellarjaycw/${project}`);
    response.push(data);
  }

  const repos = await Promise.all(
    response.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      productionUrl: repo.homepage,
      repositoryUrl: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    }))
  );

  return {
    props: { repos },
  };
};
