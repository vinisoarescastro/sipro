import { useState } from 'react';
import type { PageId } from './types';

import Login from './pages/Login';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import QuestoesCadastrar from './pages/questoes/QuestoesCadastrar';
import AvaliacoesCriar from './pages/avaliacoes/AvaliacoesCriar';
import CorrecaoAutomatica from './pages/correcoes/CorrecaoAutomatica';
import EmDesenvolvimento from './components/ui/EmDesenvolvimento';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageId>('home');

  function navigate(id: PageId) {
    setCurrentPage(id);
  }

  function renderPage() {
    switch (currentPage) {
      case 'home':
        return <Home navigate={navigate} />;
      case 'questoes-cadastrar':
        return <QuestoesCadastrar />;
      case 'avaliacoes-criar':
        return <AvaliacoesCriar />;
      case 'correcoes-automatica':
        return <CorrecaoAutomatica />;
      default:
        return <EmDesenvolvimento pageId={currentPage} navigate={navigate} />;
    }
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout
      currentPage={currentPage}
      navigate={navigate}
      onLogout={() => {
        setIsAuthenticated(false);
        setCurrentPage('home');
      }}
    >
      {renderPage()}
    </Layout>
  );
}
