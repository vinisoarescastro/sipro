import type { PageId } from '../../types';

interface HeaderProps {
  currentPage: PageId;
  onMenuToggle: () => void;
}

interface PageMeta {
  breadcrumb: string[];
  title: string;
}

function getPageMeta(page: PageId): PageMeta {
  const map: Record<PageId, PageMeta> = {
    home: { breadcrumb: [], title: 'Início' },
    'questoes-cadastrar': { breadcrumb: ['Questões'], title: 'Cadastrar Questão' },
    'questoes-consultar': { breadcrumb: ['Questões'], title: 'Consultar Questões' },
    'questoes-editar': { breadcrumb: ['Questões'], title: 'Editar Questão' },
    'questoes-excluir': { breadcrumb: ['Questões'], title: 'Excluir Questão' },
    'questoes-importar': { breadcrumb: ['Questões'], title: 'Importar Questões' },
    'avaliacoes-criar': { breadcrumb: ['Avaliações'], title: 'Criar Avaliação' },
    'avaliacoes-consultar': { breadcrumb: ['Avaliações'], title: 'Consultar Avaliações' },
    'avaliacoes-editar': { breadcrumb: ['Avaliações'], title: 'Editar Avaliação' },
    'avaliacoes-desempenho': { breadcrumb: ['Avaliações'], title: 'Desempenho' },
    'correcoes-manual': { breadcrumb: ['Correções'], title: 'Correção Manual' },
    'correcoes-automatica': { breadcrumb: ['Correções'], title: 'Correção Automática' },
    'correcoes-ajustar': { breadcrumb: ['Correções'], title: 'Ajustar Notas' },
    'correcoes-revisao': { breadcrumb: ['Correções'], title: 'Revisão de Respostas' },
    'correcoes-historico': { breadcrumb: ['Correções'], title: 'Histórico de Correções' },
    'relatorios-desempenho': { breadcrumb: ['Relatórios'], title: 'Desempenho' },
    'relatorios-questoes': { breadcrumb: ['Relatórios'], title: 'Questões' },
    'relatorios-individual': { breadcrumb: ['Relatórios'], title: 'Individual' },
    'relatorios-graficos': { breadcrumb: ['Relatórios'], title: 'Gráficos' },
    'relatorios-participacao': { breadcrumb: ['Relatórios'], title: 'Participação' },
  };
  return map[page] ?? { breadcrumb: [], title: 'SIPRO' };
}

export default function Header({ currentPage, onMenuToggle }: HeaderProps) {
  const { breadcrumb, title } = getPageMeta(currentPage);

  return (
    <header className="page-header">
      <button className="hamburger-btn" onClick={onMenuToggle} type="button" aria-label="Menu">
        <i className="bi bi-list" />
      </button>

      <div className="header-breadcrumb">
        {breadcrumb.length > 0 && (
          <div className="breadcrumb-trail">
            <span>Início</span>
            {breadcrumb.map(crumb => (
              <span key={crumb}>{crumb}</span>
            ))}
          </div>
        )}
        <div className="header-page-title">{title}</div>
      </div>
    </header>
  );
}
