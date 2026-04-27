import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Megaphone, LogOut } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../../hooks/useAuth'

export default function Layout() {
  const navigate = useNavigate()
  const { logout, advertiserId } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    clsx('flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
      isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100')

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col p-4 gap-1">
        <div className="mb-6 px-2">
          <h1 className="text-lg font-semibold text-gray-900">AdTech Platform</h1>
          <p className="text-xs text-gray-500 mt-1 truncate">{advertiserId}</p>
        </div>
        <nav className="flex-1 space-y-1">
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
          <NavLink to="/campaigns" className={linkClass}>
            <Megaphone size={16} /> Campaigns
          </NavLink>
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors w-full"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>
      <main className="flex-1 p-6 bg-surface">
        <Outlet />
      </main>
    </div>
  )
}
