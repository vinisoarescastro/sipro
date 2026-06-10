import type { PageId } from '../../types';

interface EmDesenvolvimentoProps {
  pageId: PageId;
  navigate: (id: PageId) => void;
}

function getPageName(pageId: PageId): string {
  const names: Record<PageId, string> = {
    home: 'Início',
    'questoes-cadastrar': 'Cadastrar Questão',
    'questoes-consultar': 'Consultar Questões',
    'questoes-editar': 'Editar Questão',
    'questoes-excluir': 'Excluir Questão',
    'questoes-importar': 'Importar Questões',
    'avaliacoes-criar': 'Criar Avaliação',
    'avaliacoes-consultar': 'Consultar Avaliações',
    'avaliacoes-editar': 'Editar Avaliação',
    'avaliacoes-desempenho': 'Desempenho de Avaliações',
    'correcoes-manual': 'Correção Manual',
    'correcoes-automatica': 'Correção Automática',
    'correcoes-ajustar': 'Ajustar Notas',
    'correcoes-revisao': 'Revisão de Respostas',
    'correcoes-historico': 'Histórico de Correções',
    'relatorios-desempenho': 'Relatório de Desempenho',
    'relatorios-questoes': 'Relatório de Questões',
    'relatorios-individual': 'Relatório Individual',
    'relatorios-graficos': 'Relatório com Gráficos',
    'relatorios-participacao': 'Relatório de Participação',
  };
  return names[pageId] ?? pageId;
}

export default function EmDesenvolvimento({ pageId, navigate }: EmDesenvolvimentoProps) {
  const pageName = getPageName(pageId);

  return (
    <div className="em-dev-page">
      <div className="em-dev-card">
        <div className="em-dev-icon-wrap">
          <i className="bi bi-cone-striped" />
        </div>

        <div className="em-dev-title">Em Desenvolvimento</div>

        <div className="em-dev-page-name">
          <i className="bi bi-code-slash" />
          {pageName}
        </div>

        <p className="em-dev-subtitle">
          Esta funcionalidade está em desenvolvimento e estará disponível em breve.
          A equipe está trabalhando para entregar uma experiência completa e confiável.
        </p>

        <button
          className="btn btn-primary"
          onClick={() => navigate('home')}
          type="button"
        >
          <i className="bi bi-house" />
          Voltar ao início
        </button>
      </div>
    </div>
  );
}
