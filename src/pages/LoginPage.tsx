import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuthError, login } from '../features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { ErrorBanner } from '../components/ui/ErrorBanner'

export const LoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const authState = useAppSelector((state) => state.auth)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    return () => {
      dispatch(clearAuthError())
    }
  }, [dispatch])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = await dispatch(
      login({ username: username.trim(), password: password.trim() }),
    )

    if (login.fulfilled.match(result)) {
      navigate(result.payload.role === 'USER' ? '/production' : '/products', {
        replace: true,
      })
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand">
          <h1>Autoflex</h1>
          <p>Painel de Produção</p>
        </div>

        <header>
          <h2>Entrar</h2>
          <p className="caption">Use sua conta para acessar o painel.</p>
        </header>

        <ErrorBanner message={authState.error} />

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Usuário
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" className="button primary" disabled={authState.loading}>
            {authState.loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  )
}
