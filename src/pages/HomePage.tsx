import React from 'react';
import { Hero } from '../components/home/Hero';
import { DailyQuote } from '../components/home/DailyQuote';
import { FeatureCards } from '../components/home/FeatureCards';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <DailyQuote />
      <FeatureCards />
    </>
  );
};

export default HomePage;
