import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProgressProvider } from './context/ProgressContext';
import { Home } from './pages/Home';
import { ChaptersList } from './pages/ChaptersList';
import { Resources } from './pages/Resources';
import { Progress } from './pages/Progress';
import { ProbabilityFoundations } from './pages/chapters/ProbabilityFoundations';
import { RandomVariables } from './pages/chapters/RandomVariables';
import { BayesianProbability } from './pages/chapters/BayesianProbability';
import { MarkovModels } from './pages/chapters/MarkovModels';
import { StatisticalLearning } from './pages/chapters/StatisticalLearning';
import './styles/App.css';

function App() {
  return (
    <Router>
      <ProgressProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chapters" element={<ChaptersList />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/chapters/probability-foundations" element={<ProbabilityFoundations />} />
            <Route path="/chapters/random-variables" element={<RandomVariables />} />
            <Route path="/chapters/bayesian-probability" element={<BayesianProbability />} />
            <Route path="/chapters/markov-models" element={<MarkovModels />} />
            <Route path="/chapters/statistical-learning" element={<StatisticalLearning />} />
          </Routes>
        </Layout>
      </ProgressProvider>
    </Router>
  );
}

export default App;
