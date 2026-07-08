import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Compass, BookOpen, Users, Calculator } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/', label: '首页', icon: Compass },
  { path: '/courses', label: '课程导览', icon: BookOpen },
  { path: '/teachers', label: '教师列表', icon: Users },
  { path: '/planner', label: '学分规划', icon: Calculator },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-xl font-bold text-primary-700">
            <span className="text-2xl">🧭</span>
            <span className="hidden sm:inline">CourseCompass</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Quiz CTA - Desktop */}
          <div className="hidden md:block">
            <Link to="/quiz" className="btn-primary text-sm">
              开始测评
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              )
            })}
            <Link
              to="/quiz"
              onClick={() => setMobileOpen(false)}
              className="btn-primary text-center block mt-3"
            >
              开始测评
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Bottom Tab - only on small screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around h-14">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 text-xs ${
                  isActive ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
