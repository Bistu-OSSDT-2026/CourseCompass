import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import QuizResult from './pages/QuizResult'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Teachers from './pages/Teachers'
import TeacherDetail from './pages/TeacherDetail'
import Planner from './pages/Planner'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* 移动端底部留白（避免被 Tab 遮挡） */}
      <main className="md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/result" element={<QuizResult />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/:id" element={<TeacherDetail />} />
          <Route path="/planner" element={<Planner />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="hidden md:block border-t border-gray-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center">
          <p className="text-sm text-gray-400">
            CourseCompass · 选课指南 · 五人小组开源项目
          </p>
          <p className="text-xs text-gray-300 mt-1">
            Made with ❤️ for every student
          </p>
        </div>
      </footer>
    </div>
  )
}
