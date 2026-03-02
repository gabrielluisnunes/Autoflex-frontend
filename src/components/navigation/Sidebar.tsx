import { NavLink } from 'react-router-dom'
import { logout } from '../../features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import type { UserRole } from '../../services/api/types'

const navItems = [
  { to: '/products', label: 'Produtos', roles: ['ADMIN'] as UserRole[] },
  { to: '/raw-materials', label: 'Matérias-primas', roles: ['ADMIN'] as UserRole[] },
  { to: '/dashboard', label: 'Dashboard', roles: ['ADMIN', 'USER'] as UserRole[] },
  { to: '/production', label: 'Produção', roles: ['ADMIN', 'USER'] as UserRole[] },
]

export const Sidebar = () => {
  const dispatch = useAppDispatch()
  const role = useAppSelector((state) => state.auth.role)
  const username = useAppSelector((state) => state.auth.username)

  const visibleNavItems = navItems.filter((item) =>
    role ? item.roles.includes(role) : false,
  )

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <h1>Autoflex</h1>
        <p>Painel de Produção</p>
      </div>
      <nav className="nav-list">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="caption">
          {username ? `Usuário: ${username}` : 'Usuário não identificado'}
        </p>
        <button className="button secondary" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </aside>
  )
}
