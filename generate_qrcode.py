import qrcode
import os

# Dados do aluno
nome = "Vinicius Soares"
matricula = "12345678"

# Cria o texto que será armazenado no QR Code
texto = f"Nome: {nome}, Matrícula: {matricula}"

# Diretório para salvar as imagens
diretorio = "qr_codes"
if not os.path.exists(diretorio):
    os.makedirs(diretorio)

# Encontra o próximo número sequencial para o nome do arquivo
numero = 1
while True:
    nome_arquivo = f"qrcode{numero:04d}.png"  # Formato qrcode0001.png, qrcode0002.png, etc.
    caminho_arquivo = os.path.join(diretorio, nome_arquivo)
    if not os.path.exists(caminho_arquivo):
        break
    numero += 1

# Cria o QR Code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(texto)
qr.make(fit=True)

# Cria a imagem do QR Code
img = qr.make_image(fill='black', back_color='white')

# Salva a imagem no caminho especificado
img.save(caminho_arquivo)

print(f"QR Code gerado e salvo como '{nome_arquivo}' na pasta '{diretorio}'")
