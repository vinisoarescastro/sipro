import { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [emailCpf, setEmailCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (emailCpf === '12345678900' && password === '12345678') {
        onLogin();
      } else {
        setError('CPF/e-mail ou senha incorretos. Verifique suas credenciais e tente novamente.');
      }
      setLoading(false);
    }, 500);
  }

  return (
    <div className="login-page">
      {/* Decorative gradients */}
      <div className="login-glow login-glow-top" />
      <div className="login-glow login-glow-bottom" />

      <div className="login-wrapper">
        {/* Logo acima do card — um pouco maior */}
        <img
          src="/img/logos/logo-seduc-128px.png"
          alt="Logo SEDUC-GO"
          className="login-logo"
        />

        {/* Card */}
        <div className="login-card">
          <div className="login-card-top-bar" />

          <div className="login-card-body">
            <h2 className="login-card-title">Acesse sua conta</h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="emailCpf">
                  <i className="bi bi-person" /> CPF ou E-mail
                </label>
                <input
                  id="emailCpf"
                  type="text"
                  placeholder="Digite seu CPF ou e-mail"
                  value={emailCpf}
                  onChange={e => setEmailCpf(e.target.value)}
                  autoComplete="username"
                  autoFocus
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="password">
                  <i className="bi bi-lock" /> Senha
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading || !emailCpf || !password}
              >
                {loading ? (
                  <>
                    <i className="bi bi-arrow-clockwise spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <i className="bi bi-arrow-right login-btn-arrow" />
                  </>
                )}
              </button>

              {error && (
                <div className="login-error">
                  <i className="bi bi-exclamation-circle-fill" />
                  {error}
                </div>
              )}
            </form>

            <div className="login-card-footer">
              <a href="#" className="login-link-forgot">Esqueceu sua senha?</a>
            </div>
          </div>
        </div>

        <p className="login-caption">
          Acesso restrito a servidores autorizados da<br />
          Secretaria de Estado da Educação de Goiás
        </p>
      </div>

      {/* Logo governo — canto inferior direito */}
      <div className="login-gov-logo">
        <img src="/img/logos/logo-governo-goias.png" alt="Governo de Goiás" />
      </div>
    </div>
  );
}
