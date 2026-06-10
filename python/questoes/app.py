import json
import os
import uuid
import tempfile
import traceback
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from fpdf import FPDF

app = Flask(__name__)
CORS(app)

DATA_FILE = os.path.join(os.path.dirname(__file__), "questoes.json")


def _load():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def _validate(payload):
    errors = []
    if not payload.get("enunciado", "").strip():
        errors.append("O enunciado é obrigatório.")
    tipo = payload.get("tipo")
    if tipo not in ("multipla_escolha", "verdadeiro_falso"):
        errors.append("Tipo deve ser 'multipla_escolha' ou 'verdadeiro_falso'.")
    if tipo == "multipla_escolha":
        alternativas = payload.get("alternativas", [])
        if len(alternativas) < 2 or len(alternativas) > 5:
            errors.append("Múltipla escolha requer entre 2 e 5 alternativas.")
        for i, alt in enumerate(alternativas):
            if not alt.get("texto", "").strip():
                errors.append(f"Alternativa {i + 1} não pode ser vazia.")
        gabarito = payload.get("gabarito")
        indices = list(range(len(alternativas)))
        if gabarito not in indices:
            errors.append("Gabarito deve ser o índice de uma alternativa válida.")
    if tipo == "verdadeiro_falso":
        gabarito = payload.get("gabarito")
        if gabarito not in (True, False):
            errors.append("Gabarito para verdadeiro/falso deve ser true ou false.")
    if not payload.get("disciplina", "").strip():
        errors.append("A disciplina é obrigatória.")
    return errors


@app.get("/questoes")
def listar():
    questoes = _load()
    disciplina = request.args.get("disciplina")
    tipo = request.args.get("tipo")
    if disciplina:
        questoes = [q for q in questoes if q["disciplina"].lower() == disciplina.lower()]
    if tipo:
        questoes = [q for q in questoes if q["tipo"] == tipo]
    return jsonify(questoes), 200


@app.post("/questoes")
def cadastrar():
    payload = request.get_json(silent=True)
    if not payload:
        return jsonify({"erro": "Payload JSON inválido."}), 400
    erros = _validate(payload)
    if erros:
        return jsonify({"erros": erros}), 422
    questoes = _load()
    nova = {
        "id": str(uuid.uuid4()),
        "enunciado": payload["enunciado"].strip(),
        "tipo": payload["tipo"],
        "alternativas": payload.get("alternativas", []),
        "gabarito": payload["gabarito"],
        "disciplina": payload["disciplina"].strip(),
        "nivel": payload.get("nivel", "medio"),
    }
    questoes.append(nova)
    _save(questoes)
    return jsonify(nova), 201


@app.get("/questoes/<questao_id>")
def buscar(questao_id):
    questoes = _load()
    questao = next((q for q in questoes if q["id"] == questao_id), None)
    if not questao:
        return jsonify({"erro": "Questão não encontrada."}), 404
    return jsonify(questao), 200


@app.put("/questoes/<questao_id>")
def editar(questao_id):
    payload = request.get_json(silent=True)
    if not payload:
        return jsonify({"erro": "Payload JSON inválido."}), 400
    erros = _validate(payload)
    if erros:
        return jsonify({"erros": erros}), 422
    questoes = _load()
    idx = next((i for i, q in enumerate(questoes) if q["id"] == questao_id), None)
    if idx is None:
        return jsonify({"erro": "Questão não encontrada."}), 404
    questoes[idx].update({
        "enunciado": payload["enunciado"].strip(),
        "tipo": payload["tipo"],
        "alternativas": payload.get("alternativas", []),
        "gabarito": payload["gabarito"],
        "disciplina": payload["disciplina"].strip(),
        "nivel": payload.get("nivel", "medio"),
    })
    _save(questoes)
    return jsonify(questoes[idx]), 200


@app.delete("/questoes/<questao_id>")
def excluir(questao_id):
    questoes = _load()
    nova_lista = [q for q in questoes if q["id"] != questao_id]
    if len(nova_lista) == len(questoes):
        return jsonify({"erro": "Questão não encontrada."}), 404
    _save(nova_lista)
    return jsonify({"mensagem": "Questão excluída com sucesso."}), 200


# ── PDF generation ────────────────────────────────────────────

LOGO_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "img", "logos", "logo-seduc-128px.png"
)

class _PDF(FPDF):
    def header(self):
        if os.path.exists(LOGO_PATH):
            self.image(LOGO_PATH, 10, 8, 28)
        self.set_font("Arial", "B", 13)
        self.cell(0, 10, "SIPRO - Sistema de Provas - SEDUC-GO", ln=True, align="C")
        self.ln(2)

    def footer(self):
        self.set_y(-13)
        self.set_font("Arial", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"Página {self.page_no()}", align="C")


def _gerar_pdf(dados):
    pdf = _PDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Cabeçalho da prova
    pdf.set_font("Arial", "B", 16)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, dados.get("titulo", "Avaliação"), ln=True, align="C")
    pdf.ln(2)

    # Informações da prova
    pdf.set_font("Arial", size=11)
    if dados.get("data"):
        pdf.cell(0, 7, f"Data: {dados['data']}    Turno: {dados.get('turno', '').capitalize()}", ln=True)
    if dados.get("descricao"):
        pdf.multi_cell(0, 6, f"Instruções: {dados['descricao']}")
    pdf.ln(3)
    pdf.set_draw_color(0, 0, 0)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(5)

    # Questões
    letras = ["a", "b", "c", "d", "e"]
    for i, questao in enumerate(dados.get("questoes", []), start=1):
        enunciado = questao.get("enunciado") or questao.get("titulo", "")
        pdf.set_font("Arial", "B", 12)
        pdf.multi_cell(0, 7, f"{i}. {enunciado}")

        tipo = questao.get("tipo", "")
        if tipo == "multipla-escolha":
            pdf.set_font("Arial", size=11)
            for j, alt in enumerate(questao.get("alternativas", [])):
                if alt and alt.strip():
                    pdf.cell(0, 6, f"   {letras[j]}) {alt}", ln=True)
        elif tipo == "verdadeiro-falso":
            pdf.set_font("Arial", size=11)
            pdf.cell(0, 6, "   ( ) Verdadeiro    ( ) Falso", ln=True)
        elif tipo == "dissertativa":
            pdf.set_font("Arial", size=11)
            pdf.ln(2)
            for _ in range(4):
                pdf.cell(0, 8, "_" * 90, ln=True)

        pdf.ln(3)
        pdf.set_draw_color(200, 200, 200)
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(4)

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    pdf.output(tmp.name)
    return tmp.name


@app.post("/gerar-prova")
def gerar_prova():
    try:
        dados = request.get_json(silent=True)
        if not dados:
            return jsonify({"erro": "Payload JSON inválido."}), 400
        arquivo = _gerar_pdf(dados)
        nome = (dados.get("titulo") or "prova").replace(" ", "_").lower() + ".pdf"
        response = send_file(arquivo, as_attachment=True, download_name=nome, mimetype="application/pdf")
        return response
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"erro": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5001)
