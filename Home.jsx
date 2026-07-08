import { Link } from 'react-router-dom'
import { Compass, BookOpen, Users, Calculator, ArrowRight, Star } from 'lucide-react'

const FEATURES = [
  {
    icon: Compass,
    title: 'Holland 兴趣测评',
    desc: '20道问题了解你的职业兴趣倾向，匹配最适合你的发展方向和课程',
    link: '/quiz',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: BookOpen,
    title: '课程导览',
    desc: '按方向、学分、类型筛选全部课程，查看详细信息和真实评价',
    link: '/courses',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Users,
    title: '教师信息',
    desc: '查看授课教师的职称、研究方向与开设课程，选课前了解老师风格',
    link: '/teachers',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Calculator,
    title: '学分规划器',
    desc: '输入已修学分，实时计算差额，智能推荐补足课程，毕业不慌',
    link: '/planner',
    color: 'bg-orange-50 text-orange-600',
  },
]

export default function Home() {
  return (
    <div className="pb-20 md:pb-0">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
              选课不迷茫，
              <br />
              找到属于你的学习方向
            </h1>
            <p className="text-primary-100 text-base sm:text-lg mb-8 max-w-xl">
              基于 Holland 职业兴趣理论，帮你发现适合自己的发展方向，
              查看真实课程评价，科学规划大学学分。
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/quiz"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
              >
                免费开始测评
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                浏览课程
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { value: '20题', label: '兴趣测评' },
                { value: '50+', label: '收录课程' },
                { value: '20+', label: '教师信息' },
                { value: '100%', label: '免费使用' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-primary-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 核心用户场景 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            不管你是新生还是老生，都值得一看
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            完全学分制下，选课不再凭感觉——用数据和经验帮你决策
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FEATURES.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                to={item.link}
                className="card group hover:border-primary-300 hover:shadow-xl transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}
                >
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-sm text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>立即体验</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 主流程指引 */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              三步找到最佳选课方案
            </h2>
            <p className="text-gray-500">尤其适合大一新生，0 基础也能轻松上手</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: '01', title: '兴趣测评', desc: '花3分钟完成20道选择题，了解你的Holland职业兴趣类型', icon: '🎯' },
              { step: '02', title: '探索方向', desc: '根据测评结果获取推荐发展方向和对应课程列表', icon: '🗺️' },
              { step: '03', title: '科学选课', desc: '查看课程详情、真实学生评价，用学分规划器确保毕业不慌', icon: '✅' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-xs text-primary-600 font-bold mb-2">{item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-primary-600 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">准备好开始你的选课之旅了吗？</h2>
          <p className="text-primary-100 mb-6 max-w-md mx-auto">
            用科学的测评方法，找到最适合你的课程和发展方向
          </p>
          <Link
            to="/quiz"
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
          >
            开始测评 <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
