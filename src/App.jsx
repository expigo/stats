import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { ChaptersList } from './pages/ChaptersList';
import { Resources } from './pages/Resources';
import { ProbabilityFoundations } from './pages/chapters/ProbabilityFoundations';
import { RandomVariables } from './pages/chapters/RandomVariables';
import { BayesianProbability } from './pages/chapters/BayesianProbability';
import { MarkovModels } from './pages/chapters/MarkovModels';
import { StatisticalLearning } from './pages/chapters/StatisticalLearning';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chapters" element={<ChaptersList />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/chapters/probability-foundations" element={<ProbabilityFoundations />} />
          <Route path="/chapters/random-variables" element={<RandomVariables />} />
          <Route path="/chapters/bayesian-probability" element={<BayesianProbability />} />
          <Route path="/chapters/markov-models" element={<MarkovModels />} />
          <Route path="/chapters/statistical-learning" element={<StatisticalLearning />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
