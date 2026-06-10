import { useState, useEffect, useRef, useCallback } from 'react';

const API_PROCESSAR = 'http://127.0.0.1:5000/processar';

interface Resultado {
  acertos: number;
  erros: number;
  pontuacao: number;
}

export default function CorrecaoAutomatica() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [processando, setProcessando] = useState(false);
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    setErro(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraAtiva(true);
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Permissão de câmera negada. Habilite o acesso à câmera nas configurações do navegador.'
          : err instanceof DOMException && err.name === 'NotFoundError'
          ? 'Nenhuma câmera encontrada neste dispositivo.'
          : 'Não foi possível acessar a câmera.';
      setErro(msg);
      setCameraAtiva(false);
    }
  }, []);

  useEffect(() => {
    void startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [startCamera]);

  async function handleProcessar() {
    if (!videoRef.current || !cameraAtiva) {
      setErro('Câmera não está ativa. Aguarde ou recarregue a página.');
      return;
    }

    setProcessando(true);
    setErro(null);

    try {
      // Capture frame from video to canvas
      const canvas = canvasRef.current ?? document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Não foi possível criar contexto 2D.');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64
      const base64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];

      const response = await fetch(API_PROCESSAR, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagem: base64 }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as Resultado;
      setResultado(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao processar imagem.';
      setErro(`Falha no processamento: ${msg}`);
    } finally {
      setProcessando(false);
    }
  }

  return (
    <div className="correcao-layout">
      {/* Camera card */}
      <div className="camera-card">
        <div className="camera-card-header">
          <i className="bi bi-camera-fill" style={{ color: 'var(--cat-c)', fontSize: '16px' }} />
          <div className="camera-card-title">Câmera — Leitura de Gabarito</div>
          {cameraAtiva && (
            <div className="live-indicator">
              <span className="live-dot" />
              AO VIVO
            </div>
          )}
        </div>

        <div className="camera-video-wrap">
          {cameraAtiva ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
            />
          ) : (
            <div className="camera-no-feed">
              <i className="bi bi-camera-video-off" />
              <span>Câmera não disponível</span>
            </div>
          )}
        </div>

        {/* Hidden canvas for frame capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className="camera-card-footer">
          {!cameraAtiva && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => void startCamera()}
              style={{ marginBottom: '8px', width: '100%', justifyContent: 'center' }}
            >
              <i className="bi bi-camera" />
              Ativar câmera
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => void handleProcessar()}
            disabled={processando || !cameraAtiva}
          >
            {processando ? (
              <>
                <i className="bi bi-arrow-clockwise spin" />
                Processando...
              </>
            ) : (
              <>
                <i className="bi bi-check2-circle" />
                Processar Gabarito
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result card */}
      <div className="resultado-card">
        <div className="card-header" style={{ marginBottom: '12px' }}>
          <div className="card-title">
            <i className="bi bi-clipboard-check" style={{ color: 'var(--brand)' }} />
            Resultado da Correção
          </div>
        </div>

        {erro && (
          <div className="resultado-error">
            <i className="bi bi-exclamation-triangle-fill" style={{ flexShrink: 0 }} />
            <span>{erro}</span>
          </div>
        )}

        {!resultado && !erro && (
          <div className="resultado-empty">
            <i className="bi bi-clipboard2" />
            <div style={{ fontWeight: 600, color: 'var(--gray-600)' }}>Aguardando leitura</div>
            <div style={{ fontSize: '13px' }}>
              Posicione o gabarito na frente da câmera e clique em "Processar Gabarito".
            </div>
          </div>
        )}

        {resultado && (
          <div>
            <div
              style={{
                background: 'linear-gradient(135deg, var(--navy), var(--navy-mid))',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '16px',
              }}
            >
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                PONTUAÇÃO FINAL
              </div>
              <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--brand)', lineHeight: 1 }}>
                {resultado.pontuacao.toFixed(1)}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                pontos
              </div>
            </div>

            <div className="resultado-scores">
              <div className="score-box score-box-success">
                <div className="score-num">{resultado.acertos}</div>
                <div className="score-label">Acertos</div>
              </div>
              <div className="score-box score-box-error">
                <div className="score-num">{resultado.erros}</div>
                <div className="score-label">Erros</div>
              </div>
              <div className="score-box score-box-brand">
                <div className="score-num">
                  {resultado.acertos + resultado.erros}
                </div>
                <div className="score-label">Total</div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setResultado(null)}
              style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
            >
              <i className="bi bi-arrow-counterclockwise" />
              Nova correção
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
