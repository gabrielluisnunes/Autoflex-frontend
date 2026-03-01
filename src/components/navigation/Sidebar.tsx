import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/products', label: 'Products' },
  { to: '/raw-materials', label: 'Raw Materials' },
  { to: '/production', label: 'Production' },
]

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="brand">
        <h1>Autoflex</h1>
        <p>Production Dashboard</p>
      </div>
      <nav className="nav-list">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
