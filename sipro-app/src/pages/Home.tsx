import type { PageId } from '../types';

interface HomeProps {
  navigate: (id: PageId) => void;
}

interface StatCard {
  icon: string;
  iconBg: string;
  iconColor: string;
  value: number;
  label: string;
}

// TODO: Replace hardcoded zeros with real data from API
const stats: StatCard[] = [
  { icon: 'bi-question-circle-fill', iconBg: 'var(--cat-q-bg)', iconColor: 'var(--cat-q-dk)', value: 0, label: 'Questões cadastradas' },
  { icon: 'bi-file-earmark-text-fill', iconBg: 'var(--cat-a-bg)', iconColor: 'var(--cat-a-dk)', value: 0, label: 'Avaliações criadas' },
  { icon: 'bi-camera-fill', iconBg: 'var(--cat-c-bg)', iconColor: 'var(--cat-c-dk)', value: 0, label: 'Correções realizadas' },
  { icon: 'bi-bar-chart-fill', iconBg: 'var(--cat-r-bg)', iconColor: 'var(--cat-r-dk)', value: 0, label: 'Relatórios gerados' },
];

interface QuickCard {
  id: PageId;
  variant: string;
  icon: string;
  iconClass: string;
  title: string;
  desc: string;
}

const quickCards: QuickCard[] = [
  {
    id: 'questoes-cadastrar',
    variant: 'quick-card-q',
    icon: 'bi-question-circle',
    iconClass: 'quick-card-icon-q',
    title: 'Questões',
    desc: 'Cadastre e gerencie o banco de questões para suas avaliações.',
  },
  {
    id: 'avaliacoes-criar',
    variant: 'quick-card-a',
    icon: 'bi-file-earmark-text',
    iconClass: 'quick-card-icon-a',
    title: 'Avaliações',
    desc: 'Monte provas completas e gere arquivos PDF prontos para impressão.',
  },
  {
    id: 'correcoes-automatica',
    variant: 'quick-card-c',
    icon: 'bi-camera',
    iconClass: 'quick-card-icon-c',
    title: 'Correções',
    desc: 'Corrija gabaritos automaticamente usando a câmera do dispositivo.',
  },
  {
    id: 'relatorios-desempenho',
    variant: 'quick-card-r',
    icon: 'bi-bar-chart',
    iconClass: 'quick-card-icon-r',
    title: 'Relatórios',
    desc: 'Visualize o desempenho de turmas e alunos com gráficos detalhados.',
  },
];

export default function Home({ navigate }: HomeProps) {
  return (
    <div>
      {/* Welcome banner */}
      <div className="home-welcome">
        <div className="home-welcome-header">
          <div>
            <div className="home-welcome-title">Olá, Vinícius!</div>
            <div className="home-welcome-sub">
              Bem-vindo ao SIPRO, seu sistema integrado de gestão de provas da SEDUC-GO.
            </div>
          </div>
          <div className="home-welcome-badge">
            <span className="pulse-dot" />
            Sistema Ativo
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {stats.map(stat => (
          <div className="stat-card" key={stat.label}>
            <div
              className="stat-card-icon"
              style={{ background: stat.iconBg, color: stat.iconColor }}
            >
              <i className={`bi ${stat.icon}`} />
            </div>
            <div className="stat-card-value">{stat.value}</div>
            <div className="stat-card-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick access */}
      <div className="home-section-title">
        <i className="bi bi-lightning-charge" style={{ color: 'var(--brand)' }} />
        Acesso Rápido
      </div>
      <div className="home-quick">
        {quickCards.map(card => (
          <div
            key={card.id}
            className={`quick-card ${card.variant}`}
            onClick={() => navigate(card.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate(card.id)}
          >
            <div className={`quick-card-icon ${card.iconClass}`}>
              <i className={`bi ${card.icon}`} />
            </div>
            <div className="quick-card-title">{card.title}</div>
            <div className="quick-card-desc">{card.desc}</div>
            <div className="quick-card-link">Acessar &rarr;</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="home-section-title">
        <i className="bi bi-clock-history" style={{ color: 'var(--gray-400)' }} />
        Atividade Recente
      </div>
      <div className="activity-empty">
        <i className="bi bi-inbox" />
        Nenhuma atividade recente. Comece criando uma questão ou avaliação.
      </div>
    </div>
  );
}
