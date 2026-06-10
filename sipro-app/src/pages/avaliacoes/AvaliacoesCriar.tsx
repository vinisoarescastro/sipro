import { useState } from 'react';
import type { QuestaoAvaliacao } from '../../types';

const API_PROVA = 'http://127.0.0.1:5001/gerar-prova';

interface FormState {
  titulo: string;
  data: string;
  turno: string;
  descricao: string;
}

const initialForm: FormState = {
  titulo: '',
  data: '',
  turno: 'manha',
  descricao: '',
};

function makeQuestaoVazia(): QuestaoAvaliacao {
  return {
    tipo: 'multipla-escolha',
    enunciado: '',
    alternativas: ['', '', '', '', ''],
  };
}

export default function AvaliacoesCriar() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [questoes, setQuestoes] = useState<QuestaoAvaliacao[]>([makeQuestaoVazia()]);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function setQuestaoField(
    index: number,
    field: keyof Omit<QuestaoAvaliacao, 'alternativas'>,
    value: string
  ) {
    setQuestoes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function setAlternativa(questaoIndex: number, altIndex: number, value: string) {
    setQuestoes(prev => {
      const updated = [...prev];
      const alts = [...updated[questaoIndex].alternativas];
      alts[altIndex] = value;
      updated[questaoIndex] = { ...updated[questaoIndex], alternativas: alts };
      return updated;
    });
  }

  function addQuestao() {
    setQuestoes(prev => [...prev, makeQuestaoVazia()]);
  }

  function removeQuestao(index: number) {
    if (questoes.length <= 1) return;
    setQuestoes(prev => prev.filter((_, i) => i !== index));
  }

  async function handleGerarPdf() {
    setError(null);
    setSuccess(null);

    if (!form.titulo.trim()) {
      setError('O título da prova é obrigatório.');
      return;
    }
    if (questoes.some(q => !q.enunciado.trim())) {
      setError('Todas as questões precisam de um enunciado.');
      return;
    }

    setGerandoPdf(true);
    try {
      const body = {
        titulo: form.titulo,
        data: form.data,
        turno: form.turno,
        descricao: form.descricao,
        questoes: questoes.map(q => ({
          tipo: q.tipo,
          enunciado: q.enunciado,
          alternativas:
            q.tipo === 'multipla-escolha'
              ? q.alternativas.filter(a => a.trim())
              : [],
        })),
      };

      const response = await fetch(API_PROVA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prova_${form.titulo.replace(/\s+/g, '_').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess('Prova gerada com sucesso! O download começará em breve.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao gerar prova.';
      setError(`Falha ao gerar PDF: ${msg}. Verifique se o servidor está em execução.`);
    } finally {
      setGerandoPdf(false);
    }
  }

  return (
    <div className="avaliacao-form-wrap">
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <i className="bi bi-file-earmark-plus" style={{ color: 'var(--cat-a)' }} />
            Dados da Avaliação
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="titulo">Título da Prova</label>
            <input
              id="titulo"
              type="text"
              placeholder="Ex.: Avaliação de Matemática — 1º Bimestre"
              value={form.titulo}
              onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))}
            />
          </div>

          <div className="field">
            <label htmlFor="data">Data</label>
            <input
              id="data"
              type="date"
              value={form.data}
              onChange={e => setForm(p => ({ ...p, data: e.target.value }))}
            />
          </div>

          <div className="field">
            <label htmlFor="turno">Turno</label>
            <select
              id="turno"
              value={form.turno}
              onChange={e => setForm(p => ({ ...p, turno: e.target.value }))}
            >
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
              <option value="integral">Integral</option>
            </select>
          </div>

          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="descricao">Instruções / Descrição</label>
            <textarea
              id="descricao"
              placeholder="Ex.: Responda com caneta azul ou preta. Questões sem rasura."
              value={form.descricao}
              onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div style={{ marginTop: '20px' }}>
        <div className="home-section-title">
          <i className="bi bi-list-ol" style={{ color: 'var(--cat-a)' }} />
          Questões da Prova
        </div>

        {questoes.map((q, qi) => (
          <div className="questao-form-card" key={qi}>
            <div className="questao-form-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="questao-num-badge">{qi + 1}</div>
                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--navy)' }}>
                  Questão {qi + 1}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => removeQuestao(qi)}
                disabled={questoes.length <= 1}
                style={{ color: 'var(--error)' }}
              >
                <i className="bi bi-trash" />
                Remover
              </button>
            </div>

            <div className="field">
              <label>Tipo</label>
              <select
                value={q.tipo}
                onChange={e => setQuestaoField(qi, 'tipo', e.target.value)}
              >
                <option value="multipla-escolha">Múltipla Escolha</option>
                <option value="verdadeiro-falso">Verdadeiro / Falso</option>
                <option value="dissertativa">Dissertativa</option>
              </select>
            </div>

            <div className="field">
              <label>Enunciado</label>
              <textarea
                placeholder="Digite o enunciado da questão..."
                value={q.enunciado}
                onChange={e => setQuestaoField(qi, 'enunciado', e.target.value)}
                rows={3}
              />
            </div>

            {q.tipo === 'multipla-escolha' && (
              <div className="field">
                <label>Alternativas (A–E)</label>
                <div className="questao-alt-inputs">
                  {['A', 'B', 'C', 'D', 'E'].map((letra, ai) => (
                    <div className="questao-alt-row" key={letra}>
                      <div className="alternativa-letter">{letra}</div>
                      <input
                        type="text"
                        placeholder={`Alternativa ${letra}`}
                        value={q.alternativas[ai] ?? ''}
                        onChange={e => setAlternativa(qi, ai, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary"
          onClick={addQuestao}
          style={{ width: '100%', justifyContent: 'center', marginBottom: '20px' }}
        >
          <i className="bi bi-plus-circle" />
          Adicionar Questão
        </button>
      </div>

      {/* Footer */}
      <div className="card">
        {error && (
          <div className="feedback feedback-error" style={{ marginBottom: '16px' }}>
            <i className="bi bi-exclamation-circle-fill" />
            {error}
          </div>
        )}
        {success && (
          <div className="feedback feedback-success" style={{ marginBottom: '16px' }}>
            <i className="bi bi-check-circle-fill" />
            {success}
          </div>
        )}

        <div className="avaliacao-footer">
          <div className="avaliacao-counter">
            <i className="bi bi-list-ol" style={{ color: 'var(--brand)' }} />
            Nº de Questões:
            <span>{questoes.length}</span>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => void handleGerarPdf()}
            disabled={gerandoPdf}
          >
            {gerandoPdf ? (
              <>
                <i className="bi bi-arrow-clockwise spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <i className="bi bi-file-earmark-pdf" />
                Gerar Prova em PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
