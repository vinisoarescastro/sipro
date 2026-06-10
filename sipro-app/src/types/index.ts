export type PageId =
  | 'home'
  | 'questoes-cadastrar'
  | 'questoes-consultar'
  | 'questoes-editar'
  | 'questoes-excluir'
  | 'questoes-importar'
  | 'avaliacoes-criar'
  | 'avaliacoes-consultar'
  | 'avaliacoes-editar'
  | 'avaliacoes-desempenho'
  | 'correcoes-manual'
  | 'correcoes-automatica'
  | 'correcoes-ajustar'
  | 'correcoes-revisao'
  | 'correcoes-historico'
  | 'relatorios-desempenho'
  | 'relatorios-questoes'
  | 'relatorios-individual'
  | 'relatorios-graficos'
  | 'relatorios-participacao';

export type TipoQuestao = 'multipla_escolha' | 'verdadeiro_falso';
export type NivelQuestao = 'facil' | 'medio' | 'dificil';

export interface Alternativa {
  texto: string;
}

export interface Questao {
  id: string;
  enunciado: string;
  tipo: TipoQuestao;
  alternativas: Alternativa[];
  gabarito: number | boolean;
  disciplina: string;
  nivel: NivelQuestao;
}

export interface QuestaoAvaliacao {
  tipo: string;
  enunciado: string;
  alternativas: string[];
}

export interface NavSection {
  id: string;
  label: string;
  icon: string;
  color: string;
  items: NavItem[];
}

export interface NavItem {
  id: PageId;
  label: string;
  icon: string;
  implemented: boolean;
}
