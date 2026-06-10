import { useState } from 'react';
import type { PageId, NavSection } from '../../types';

interface SidebarProps {
  currentPage: PageId;
  navigate: (id: PageId) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const navSections: NavSection[] = [
  {
    id: 'questoes',
    label: 'Questões',
    icon: 'bi-question-circle',
    color: 'var(--cat-q)',
    items: [
      { id: 'questoes-cadastrar', label: 'Cadastrar', icon: 'bi-plus-circle', implemented: true },
      { id: 'questoes-consultar', label: 'Consultar', icon: 'bi-search', implemented: false },
      { id: 'questoes-editar', label: 'Editar', icon: 'bi-pencil', implemented: false },
      { id: 'questoes-excluir', label: 'Excluir', icon: 'bi-trash', implemented: false },
      { id: 'questoes-importar', label: 'Importar', icon: 'bi-upload', implemented: false },
    ],
  },
  {
    id: 'avaliacoes',
    label: 'Avaliações',
    icon: 'bi-file-earmark-text',
    color: 'var(--cat-a)',
    items: [
      { id: 'avaliacoes-criar', label: 'Criar Avaliação', icon: 'bi-file-earmark-plus', implemented: true },
      { id: 'avaliacoes-consultar', label: 'Consultar', icon: 'bi-search', implemented: false },
      { id: 'avaliacoes-editar', label: 'Editar', icon: 'bi-pencil', implemented: false },
      { id: 'avaliacoes-desempenho', label: 'Desempenho', icon: 'bi-graph-up', implemented: false },
    ],
  },
  {
    id: 'correcoes',
    label: 'Correções',
    icon: 'bi-camera',
    color: 'var(--cat-c)',
    items: [
      { id: 'correcoes-manual', label: 'Correção Manual', icon: 'bi-hand-index', implemented: false },
      { id: 'correcoes-automatica', label: 'Correção Automática', icon: 'bi-camera-fill', implemented: true },
      { id: 'correcoes-ajustar', label: 'Ajustar Notas', icon: 'bi-sliders', implemented: false },
      { id: 'correcoes-revisao', label: 'Revisão de Respostas', icon: 'bi-eye', implemented: false },
      { id: 'correcoes-historico', label: 'Histórico', icon: 'bi-clock-history', implemented: false },
    ],
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: 'bi-bar-chart',
    color: 'var(--cat-r)',
    items: [
      { id: 'relatorios-desempenho', label: 'Desempenho', icon: 'bi-bar-chart-line', implemented: false },
      { id: 'relatorios-questoes', label: 'Questões', icon: 'bi-list-check', implemented: false },
      { id: 'relatorios-individual', label: 'Individual', icon: 'bi-person-lines-fill', implemented: false },
      { id: 'relatorios-graficos', label: 'Gráficos', icon: 'bi-pie-chart', implemented: false },
      { id: 'relatorios-participacao', label: 'Participação', icon: 'bi-people', implemented: false },
    ],
  },
];

export default function Sidebar({ currentPage, navigate, onLogout, isOpen, onClose }: SidebarProps) {
  // All sections open by default
  const [openSections, setOpenSections] = useState<string[]>(['questoes', 'avaliacoes', 'correcoes', 'relatorios']);

  function toggleSection(id: string) {
    setOpenSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }

  function handleItemClick(pageId: PageId) {
    navigate(pageId);
    onClose();
  }

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar${isOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <i className="bi bi-shield-check" />
          </div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">SIPRO</span>
            <span className="sidebar-logo-sub">SEDUC-GO</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="sidebar-nav-wrapper">
        <nav className="sidebar-nav">
          {/* Home link */}
          <div
            className={`nav-item${currentPage === 'home' ? ' active' : ''}`}
            style={{ margin: '4px 8px 8px', fontWeight: 600 }}
            onClick={() => handleItemClick('home')}
          >
            <span className="nav-item-icon"><i className="bi bi-house" /></span>
            <span className="nav-item-label">Início</span>
          </div>

          {navSections.map(section => {
            const isOpen = openSections.includes(section.id);
            return (
              <div className="nav-section" key={section.id}>
                <button
                  className="nav-section-header"
                  onClick={() => toggleSection(section.id)}
                  type="button"
                >
                  <span
                    className="nav-section-dot"
                    style={{ background: section.color }}
                  />
                  <span className="nav-section-label">{section.label}</span>
                  <i className={`bi bi-chevron-right nav-section-chevron${isOpen ? ' open' : ''}`} />
                </button>

                <div className={`nav-section-items${isOpen ? ' open' : ''}`}>
                  {section.items.map(item => (
                    <div
                      key={item.id}
                      className={`nav-item${currentPage === item.id ? ' active' : ''}`}
                      onClick={() => handleItemClick(item.id)}
                    >
                      <span className="nav-item-icon"><i className={`bi ${item.icon}`} /></span>
                      <span className="nav-item-label">{item.label}</span>
                      {!item.implemented && <span className="nav-item-dot" title="Em desenvolvimento" />}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-avatar">V</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Vinícius Soares</div>
            <div className="sidebar-user-role">Administrador</div>
          </div>
          <button
            className="sidebar-logout-btn"
            onClick={onLogout}
            title="Sair"
            type="button"
          >
            <i className="bi bi-box-arrow-right" />
          </button>
        </div>
      </aside>
    </>
  );
}
