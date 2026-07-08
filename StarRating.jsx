export default function StarRating({ value = 0, max = 5, size = 'md', onChange, readonly = false }) {
  const sizeMap = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' }
  const textSize = sizeMap[size] || 'text-lg'

  const handleClick = (index) => {
    if (!readonly && onChange) {
      onChange(index + 1)
    }
  }

  return (
    <div className={`flex items-center gap-0.5 ${textSize}`}>
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          type="button"
          disabled={readonly}
          onClick={() => handleClick(i)}
          className={`transition-colors ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } ${i < value ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </button>
      ))}
      {value > 0 && (
        <span className="ml-1.5 text-sm font-medium text-gray-600">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  )
}
