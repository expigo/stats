import { ChapterCompletionButton } from '../../components/chapter/ChapterCompletionButton';

export const RandomVariables = () => {
  return (
    <div className="chapter-content fade-in">
      <div className="hero" style={{ marginBottom: '2rem' }}>
        <h1>Chapter 2: Random Variables & Distributions</h1>
        <p>The language of uncertainty in machine learning</p>
      </div>

      <div className="info-box definition">
        <h4>Work in Progress</h4>
        <p>This chapter is being migrated from the static version. Check back soon!</p>
        <p>In the meantime, check out the new Bayesian Probability and Markov Models chapters.</p>
      </div>

      <ChapterCompletionButton chapterId="random-variables" />
    </div>
  );
};
