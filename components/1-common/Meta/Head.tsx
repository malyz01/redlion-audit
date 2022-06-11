import NextHead from 'next/head';

type Props = {
  title: string;
  description: string;
};

export const Head = ({ title, description }: Props) => (
  <NextHead>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" href="/assets/images/RedLion.ico" />
  </NextHead>
);
