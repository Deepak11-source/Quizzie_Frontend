import './App.css';
import { Routes, Route } from 'react-router-dom';
import AuthenticationPage from './pages/Authentication/AuthenticationPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PrivateRoute from './utility/PrivateRoute';
import CreateQuizPage from './pages/Quiz/CreateQuizPage/CreateQuizPage';
import QuizChallenge from './pages/Quiz/QuizChallenge/QuizChallenge';
import QuizAnalysis from './pages/Quiz/QuizAnalysis/QuizAnalysis';
import QuizStats from './pages/Quiz/QuizStats/QuizStats';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthenticationPage />} />
      
      <Route path="/dashboard" element={<PrivateRoute />}>
        <Route path="" element={<DashboardPage />} />
      </Route>
      
      <Route path='/createQuiz' element={<PrivateRoute />}>
        <Route path="" element={<CreateQuizPage />} />
      </Route>
      
      <Route path='/test/:id' element={<QuizChallenge />} />
      <Route path="*" component={() => <h1>404 Not Found</h1>} />
      
      <Route path='/analytics' element={<PrivateRoute />}>
        <Route path="" element={<QuizStats />} />
      </Route>
      
      <Route path='/analysis' element={<PrivateRoute />}>
        <Route path="" element={<QuizAnalysis />} />
      </Route>
    </Routes>
  );
}

export default App;
