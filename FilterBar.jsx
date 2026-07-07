import { Search, SlidersHorizontal, X } from 'lucide-react'

const TYPE_OPTIONS = [
  { value: '', label: '全部类型' },
  { value: '专业必修', label: '专业必修' },
  { value: '专业选修', label: '专业选修' },
  { value: '公共必修', label: '公共必修' },
  { value: '公共选修', label: '公共选修' },
]

const SORT_OPTIONS = [
  { value: 'credit_desc', label: '学分降序' },
  { value: 'credit_asc', label: '学分升序' },
  { value: 'name_asc', label: '名称排序' },
]

export default function FilterBar({ filters, onFilterChange, onReset }) {
  const hasActiveFilters = filters.keyword || filters.type || filters.direction

  return (
    <div className="space-y-3">
      {/* 搜索栏 */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={filters.keyword || ''}
          onChange={(e) => onFilterChange('keyword', e.target.value)}
          placeholder="搜索课程名称或教师姓名..."
          className="input-field pl-10"
        />
      </div>

      {/* 筛选项 */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 类型筛选 */}
        <select
          value={filters.type || ''}
          onChange={(e) => onFilterChange('type', e.target.value || null)}
          className="input-field w-auto text-sm py-2"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* 排序 */}
        <select
          value={filters.sort || 'credit_desc'}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="input-field w-auto text-sm py-2"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* 学分范围 */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>学分:</span>
          <input
            type="number"
            min={0}
            max={6}
            value={filters.creditRange?.[0] ?? 0}
            onChange={(e) =>
              onFilterChange('creditRange', [Number(e.target.value), filters.creditRange?.[1] ?? 6])
            }
            className="w-14 px-2 py-1.5 border border-gray-200 rounded text-center text-sm"
          />
          <span>-</span>
          <input
            type="number"
            min={0}
            max={6}
            value={filters.creditRange?.[1] ?? 6}
            onChange={(e) =>
              onFilterChange('creditRange', [filters.creditRange?.[0] ?? 0, Number(e.target.value)])
            }
            className="w-14 px-2 py-1.5 border border-gray-200 rounded text-center text-sm"
          />
        </div>

        {/* 清除筛选 */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 px-2 py-1.5"
          >
            <X size={14} />
            清除筛选
          </button>
        )}
      </div>
    </div>
  )
}
