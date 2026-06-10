import { useState, useEffect, useCallback } from 'react';
import type { Questao, TipoQuestao, NivelQuestao } from '../../types';
import { getQuestoes, createQuestao, deleteQuestao } from '../../services/api';

const LETRAS = ['A', 'B', 'C', 'D', 'E'];

interface FormState {
  enunciado: string;
  disciplina: string;
  nivel: NivelQuestao;
  tipo: TipoQuestao;
  alternativas: string[];
  gabaritoMC: number; // index for multipla_escolha
  gabaritoVF: boolean; // true = Verdadeiro
}

const initialForm: FormState = {
  enunciado: '',
  disciplina: '',
  nivel: 'medio',
  tipo: 'multipla_escolha',
  alternativas: ['', '', '', ''],
  gabaritoMC: 0,
  gabaritoVF: true,
};

interface Feedback {
  type: 'success' | 'error';
  message: string;
}

function nivelLabel(n: NivelQuestao): string {
  return n === 'facil' ? 'Fácil' : n === 'medio' ? 'Médio' : 'Difícil';
}

function tipoLabel(t: TipoQuestao): string {
  return t === 'multipla_escolha' ? 'Múltipla Escolha' : 'V/F';
}

function nivelBadgeClass(n: NivelQuestao): string {
  return n === 'facil' ? 'badge-a' : n === 'medio' ? 'badge-q' : 'badge-r';
}

export default function QuestoesCadastrar() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [filterDisciplina, setFilterDisciplina] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchQuestoes = useCallback(async (disciplina?: string, tipo?: string) => {
    setLoading(true);
    try {
      const data = await getQuestoes(disciplina || undefined, tipo || undefined);
      setQuestoes(data);
    } catch {
      // API may not be running; show empty state silently
      setQuestoes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchQuestoes();
  }, [fetchQuestoes]);

  function resetForm() {
    setForm(initialForm);
    setFeedback(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!form.enunciado.trim()) {
      setFeedback({ type: 'error', message: 'O enunciado é obrigatório.' });
      return;
    }
    if (!form.disciplina.trim()) {
      setFeedback({ type: 'error', message: 'A disciplina é obrigatória.' });
      return;
    }
    if (form.tipo === 'multipla_escolha') {
      const nonEmpty = form.alternativas.filter(a => a.trim());
      if (nonEmpty.length < 2) {
        setFeedback({ type: 'error', message: 'Adicione pelo menos 2 alternativas.' });
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload: Omit<Questao, 'id'> = {
        enunciado: form.enunciado.trim(),
        disciplina: form.disciplina.trim(),
        nivel: form.nivel,
        tipo: form.tipo,
        alternativas:
          form.tipo === 'multipla_escolha'
            ? form.alternativas.filter(a => a.trim()).map(texto => ({ texto }))
            : [{ texto: 'Verdadeiro' }, { texto: 'Falso' }],
        gabarito:
          form.tipo === 'multipla_escolha' ? form.gabaritoMC : form.gabaritoVF,
      };
      await createQuestao(payload);
      setFeedback({ type: 'success', message: 'Questão cadastrada com sucesso!' });
      resetForm();
      await fetchQuestoes(filterDisciplina, filterTipo);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar questão.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Deseja excluir esta questão? Esta ação não pode ser desfeita.')) return;
    setDeletingId(id);
    try {
      await deleteQuestao(id);
      await fetchQuestoes(filterDisciplina, filterTipo);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir questão.';
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSearch() {
    await fetchQuestoes(filterDisciplina, filterTipo);
  }

  function setAlternativa(index: number, value: string) {
    setForm(prev => {
      const alts = [...prev.alternativas];
      alts[index] = value;
      return { ...prev, alternativas: alts };
    });
  }

  function addAlternativa() {
    if (form.alternativas.length >= 5) return;
    setForm(prev => ({ ...prev, alternativas: [...prev.alternativas, ''] }));
  }

  function removeAlternativa(index: number) {
    if (form.alternativas.length <= 2) return;
    setForm(prev => {
      const alts = prev.alternativas.filter((_, i) => i !== index);
      const gabarito = prev.gabaritoMC >= alts.length ? alts.length - 1 : prev.gabaritoMC;
      return { ...prev, alternativas: alts, gabaritoMC: gabarito };
    });
  }

  return (
    <div className="questoes-layout">
      {/* LEFT: Form */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <i className="bi bi-plus-circle" style={{ color: 'var(--brand)' }} />
            Nova Questão
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="disciplina">Disciplina</label>
            <input
              id="disciplina"
              type="text"
              placeholder="Ex.: Matemática, Português..."
              value={form.disciplina}
              onChange={e => setForm(p => ({ ...p, disciplina: e.target.value }))}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="field">
              <label htmlFor="nivel">Nível</label>
              <select
                id="nivel"
                value={form.nivel}
                onChange={e => setForm(p => ({ ...p, nivel: e.target.value as NivelQuestao }))}
              >
                <option value="facil">Fácil</option>
                <option value="medio">Médio</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="tipo">Tipo</label>
              <select
                id="tipo"
                value={form.tipo}
                onChange={e => setForm(p => ({ ...p, tipo: e.target.value as TipoQuestao }))}
              >
                <option value="multipla_escolha">Múltipla Escolha</option>
                <option value="verdadeiro_falso">Verdadeiro / Falso</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="enunciado">Enunciado</label>
            <textarea
              id="enunciado"
              placeholder="Digite o enunciado da questão..."
              value={form.enunciado}
              onChange={e => setForm(p => ({ ...p, enunciado: e.target.value }))}
              rows={4}
            />
          </div>

          {/* Alternativas */}
          {form.tipo === 'multipla_escolha' && (
            <div>
              <div className="form-section-title">Alternativas</div>
              <div style={{ marginBottom: '10px', fontSize: '12px', color: 'var(--gray-500)' }}>
                Selecione o botão de rádio ao lado da alternativa correta.
              </div>
              {form.alternativas.map((alt, i) => (
                <div className="alternativa-row" key={i}>
                  <input
                    type="radio"
                    name="gabarito"
                    checked={form.gabaritoMC === i}
                    onChange={() => setForm(p => ({ ...p, gabaritoMC: i }))}
                    title={`Marcar alternativa ${LETRAS[i]} como correta`}
                  />
                  <div className="alternativa-letter">{LETRAS[i]}</div>
                  <input
                    type="text"
                    placeholder={`Alternativa ${LETRAS[i]}`}
                    value={alt}
                    onChange={e => setAlternativa(i, e.target.value)}
                  />
                  <button
                    type="button"
                    className="alt-remove-btn"
                    onClick={() => removeAlternativa(i)}
                    disabled={form.alternativas.length <= 2}
                    title="Remover alternativa"
                  >
                    <i className="bi bi-x-circle" />
                  </button>
                </div>
              ))}
              {form.alternativas.length < 5 && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={addAlternativa}
                  style={{ marginTop: '6px' }}
                >
                  <i className="bi bi-plus" />
                  Adicionar alternativa
                </button>
              )}
            </div>
          )}

          {form.tipo === 'verdadeiro_falso' && (
            <div>
              <div className="form-section-title">Resposta Correta</div>
              <div className="vf-radio-group">
                <label className="vf-radio-label">
                  <input
                    type="radio"
                    name="vf"
                    checked={form.gabaritoVF === true}
                    onChange={() => setForm(p => ({ ...p, gabaritoVF: true }))}
                  />
                  <i className="bi bi-check-circle" />
                  Verdadeiro
                </label>
                <label className="vf-radio-label">
                  <input
                    type="radio"
                    name="vf"
                    checked={form.gabaritoVF === false}
                    onChange={() => setForm(p => ({ ...p, gabaritoVF: false }))}
                  />
                  <i className="bi bi-x-circle" />
                  Falso
                </label>
              </div>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div
              className={`feedback ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}
              style={{ marginTop: '16px' }}
            >
              <i className={`bi ${feedback.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}`} />
              {feedback.message}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              <i className="bi bi-arrow-counterclockwise" />
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <i className="bi bi-arrow-clockwise spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <i className="bi bi-floppy" />
                  Salvar questão
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT: Bank */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <i className="bi bi-collection" style={{ color: 'var(--brand)' }} />
            Banco de Questões
            <span className="badge badge-brand" style={{ marginLeft: '4px' }}>
              {questoes.length}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bank-filters" style={{ marginBottom: '14px' }}>
          <input
            type="text"
            placeholder="Filtrar disciplina..."
            value={filterDisciplina}
            onChange={e => setFilterDisciplina(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && void handleSearch()}
          />
          <select
            value={filterTipo}
            onChange={e => setFilterTipo(e.target.value)}
          >
            <option value="">Todos os tipos</option>
            <option value="multipla_escolha">Múltipla Escolha</option>
            <option value="verdadeiro_falso">Verdadeiro/Falso</option>
          </select>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => void handleSearch()}
            style={{ flexShrink: 0 }}
          >
            <i className="bi bi-search" />
          </button>
        </div>

        {/* List */}
        <div className="bank-list">
          {loading ? (
            <div className="bank-empty">
              <i className="bi bi-arrow-clockwise spin" />
              <div>Carregando questões...</div>
            </div>
          ) : questoes.length === 0 ? (
            <div className="bank-empty">
              <i className="bi bi-inbox" />
              <div>Nenhuma questão encontrada.</div>
              <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '4px' }}>
                Verifique se o servidor está em execução.
              </div>
            </div>
          ) : (
            questoes.map(q => (
              <div className="bank-item" key={q.id}>
                <div className="bank-item-header">
                  <span className="badge badge-gray">{q.disciplina}</span>
                  <span className="badge badge-c">{tipoLabel(q.tipo)}</span>
                  <span className={`badge ${nivelBadgeClass(q.nivel)}`}>{nivelLabel(q.nivel)}</span>
                </div>
                <div className="bank-item-text">{q.enunciado}</div>
                <div className="bank-item-footer">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => void handleDelete(q.id)}
                    disabled={deletingId === q.id}
                  >
                    {deletingId === q.id ? (
                      <i className="bi bi-arrow-clockwise spin" />
                    ) : (
                      <i className="bi bi-trash" />
                    )}
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
