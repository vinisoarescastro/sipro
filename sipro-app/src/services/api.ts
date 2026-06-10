import type { Questao } from '../types';

const BASE_URL = 'http://127.0.0.1:5001';

export async function getQuestoes(disciplina?: string, tipo?: string): Promise<Questao[]> {
  const params = new URLSearchParams();
  if (disciplina) params.set('disciplina', disciplina);
  if (tipo) params.set('tipo', tipo);

  const query = params.toString();
  const url = `${BASE_URL}/questoes${query ? `?${query}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro ao buscar questões: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<Questao[]>;
}

export async function createQuestao(data: Omit<Questao, 'id'>): Promise<Questao> {
  const response = await fetch(`${BASE_URL}/questoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Erro ao criar questão: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<Questao>;
}

export async function deleteQuestao(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/questoes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Erro ao excluir questão: ${response.status} ${response.statusText}`);
  }
}
