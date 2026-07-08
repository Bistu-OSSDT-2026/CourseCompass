import { useState, useCallback, useMemo } from 'react'
import { calculateHollandType } from '../constants/holland'
import { submitQuiz as apiSubmitQuiz } from '../api/quiz'

const TOTAL_QUESTIONS = 20

export function useQuiz() {
  // 阶段：'welcome' | 'answering' | 'submitting' | 'result' | 'error'
  const [phase, setPhase] = useState('welcome')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(TOTAL_QUESTIONS).fill(null))
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const progress = useMemo(
    () => Math.round((answers.filter(Boolean).length / TOTAL_QUESTIONS) * 100),
    [answers]
  )

  const progressPercent = useMemo(
    () => answers.filter(Boolean).length / TOTAL_QUESTIONS,
    [answers]
  )

  const startQuiz = useCallback(() => {
    setPhase('answering')
    setCurrentIndex(0)
    setAnswers(Array(TOTAL_QUESTIONS).fill(null))
    setResult(null)
    setError(null)
  }, [])

  const selectAnswer = useCallback(
    (value) => {
      const next = [...answers]
      next[currentIndex] = value
      setAnswers(next)
    },
    [answers, currentIndex]
  )

  const goNext = useCallback(() => {
    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setCurrentIndex((i) => i + 1)
    }
  }, [currentIndex])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
    }
  }, [currentIndex])

  const submit = useCallback(async () => {
    setPhase('submitting')
    setError(null)
    try {
      // 前端本地计算 Holland 类型
      const localResult = calculateHollandType(answers)

      // 尝试调用后端接口（如果后端不可用，使用本地计算结果）
      try {
        const apiResult = await apiSubmitQuiz(answers)
        setResult(apiResult)
      } catch {
        // 后端不可用时降级为本地计算
        setResult(localResult)
      }
      setPhase('result')
    } catch (e) {
      setError(e.message || '提交失败，请重试')
      setPhase('error')
    }
  }, [answers])

  const retry = useCallback(() => {
    setPhase('answering')
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setPhase('welcome')
    setCurrentIndex(0)
    setAnswers(Array(TOTAL_QUESTIONS).fill(null))
    setResult(null)
    setError(null)
  }, [])

  const isAnswered = (index) => answers[index] !== null

  const isComplete = answers.every((a) => a !== null)

  return {
    phase,
    currentIndex,
    answers,
    result,
    error,
    progress,
    progressPercent,
    isComplete,
    totalQuestions: TOTAL_QUESTIONS,
    startQuiz,
    selectAnswer,
    goNext,
    goPrev,
    submit,
    retry,
    reset,
    isAnswered,
  }
}
