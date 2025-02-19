from flask import Flask, request, jsonify, send_file, g 
from flask_cors import CORS 
from fpdf import FPDF
import os  
import tempfile  
import shutil  
import traceback  

app = Flask(__name__)
CORS(app)

class PDF(FPDF):
    def header(self):
        # Adiciona o logo ao cabeçalho
        self.image(r'C:\Users\70555119173\Documents\GitHub\sipro\img\logos\logo-seduc-128px.png', 10, 8, 50)
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Prova de Avaliação', 0, 1, 'C')
        self.ln(3)

    def footer(self):
        # Define a posição do rodapé
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        # Adiciona a numeração da página e créditos no rodapé
        self.cell(0, 10, f'Página {self.page_no()}', 0, 0, 'C')

def criar_pdf(dados):

    # Criação de um arquivo temporário para o PDF
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    
    pdf = PDF()
    pdf.add_page()

    # Adiciona as instruções no início do PDF
    pdf.set_font("Arial", size=10)
    instrucoes = """
    INSTRUÇÕES IMPORTANTES:

    1. Proibido consultar qualquer material durante a prova, incluindo livros, anotações, celulares e dispositivos eletrônicos. A consulta externa resultará em anulação da prova.
    2. Tempo de duração: Você tem 50 minutos para concluir esta prova.
    3. Comportamento: Conversas ou trocas de informações são estritamente proibidas.
    4. Identificação: Apresente sua identificação corretamente ao entregar a prova.
    5. Questões: A prova é composta exclusivamente por questões de múltipla escolha, com alternativas de a) até e).
    6. Revisão: Verifique suas respostas antes de entregar a prova.

    """
    pdf.multi_cell(0, 5, instrucoes)
    pdf.ln(3)

    # Adiciona uma linha horizontal após as instruções
    pdf.set_draw_color(0, 0, 0)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(5)

    # Título da prova
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(200, 10, txt="Avaliação: " + dados['titulo'], ln=True, align='C')
    pdf.ln(8)
    pdf.set_draw_color(0, 0, 0)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())  # Linha horizontal
    pdf.ln(3)

    # Descrição
    pdf.set_font("Arial", size=12)
    pdf.set_text_color(0, 0, 0) 
    pdf.multi_cell(0, 5, f"Descrição: {dados['descricao']}")
    pdf.ln(3)

    # Data e Turno
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(100, 10, f"Data: {dados['data']}", ln=True)
    pdf.cell(100, 10, f"Turno: {dados['turno']}", ln=True)
    pdf.ln(3)

    # Título das questões
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(200, 10, "Questões", ln=True, align='C')
    pdf.ln(3)

    # Questões e alternativas
    pdf.set_font("Arial", size=12)
    for i, questao in enumerate(dados['questoes'], start=1):
        
        # Adiciona a questão (título)
        pdf.set_font("Arial", 'B', 12)
        pdf.cell(200, 8, f"{i}. {questao['titulo']}", ln=True)
        pdf.set_font("Arial", size=12)

        # Se a questão for de múltipla escolha, adicionar alternativas com letras
        if questao['tipo'] == 'multipla-escolha':
            pdf.set_font("Arial", size=11)
            for index, alternativa in enumerate(questao['alternativas']):
                letra = chr(97 + index)  # Gera 'a', 'b', 'c', etc. com base no índice
                pdf.cell(0, 6, f"   {letra}) {alternativa}", ln=True)  # Adiciona a letra antes da alternativa
            pdf.ln(3)
        
        # Linha para separar as questões
        pdf.set_draw_color(200, 200, 200)  # Cor clara para a linha
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())  # Linha horizontal
        pdf.ln(4)

    # Salva o PDF no arquivo temporário
    pdf.output(temp_file.name)
    return temp_file.name  # Retorna o nome do arquivo PDF gerado

@app.route('/gerar-prova', methods=['POST'])
def gerar_prova():
    try:
        dados = request.json  # Recebe os dados do formulário em formato JSON
        print("Dados recebidos:", dados)  # Imprime os dados para depuração
        # Gera o PDF com os dados recebidos
        arquivo_pdf = criar_pdf(dados)
        # Armazena o caminho do arquivo PDF em uma variável global g
        g.arquivo_pdf = arquivo_pdf
        # Envia o PDF como resposta para o cliente
        response = send_file(arquivo_pdf, as_attachment=True)
        return response  # Retorna o arquivo PDF
    except Exception as e:
        # Caso ocorra um erro, imprime os detalhes do erro
        print("Erro ao gerar o PDF:", str(e))
        print("Detalhes do erro:", traceback.format_exc())  # Exibe a stack trace completa
        return jsonify({"erro": str(e)}), 500  # Retorna o erro como resposta JSON

# Função para garantir que o arquivo temporário seja removido após o envio
@app.after_request
def remove_temp_file(response):
    if hasattr(g, 'arquivo_pdf') and os.path.exists(g.arquivo_pdf):
        try:
            shutil.move(g.arquivo_pdf, g.arquivo_pdf)  # Move temporariamente o arquivo
            os.remove(g.arquivo_pdf)  # Exclui o arquivo após o envio
        except Exception as e:
            print(f"Erro ao tentar remover o arquivo temporário: {e}")
    return response  # Retorna a resposta final ao cliente

# Executa a aplicação Flask
if __name__ == '__main__':
    app.run(debug=True)  # Executa o servidor Flask em modo de depuração
