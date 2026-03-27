'use client'

import { STEPS } from '@/lib/types'

interface Props {
  currentStep: number
  onStepClick?: (step: number) => void
}

export default function ProgressBar({ currentStep, onStepClick }: Props) {
  return (
    <div className="w-full">
      {/* Mobile: simple counter */}
      <div className="sm:hidden mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="text-sm text-gray-500">{STEPS[currentStep - 1]?.label}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: step indicators */}
      <div className="hidden sm:flex items-center justify-between mb-8">
        {STEPS.map((step, i) => {
          const isCompleted = step.number < currentStep
          const isCurrent = step.number === currentStep
          const isClickable = onStepClick && step.number < currentStep

          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isClickable && onStepClick(step.number)}
                  disabled={!isClickable}
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-all duration-200
                    ${isCompleted ? 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700' : ''}
                    ${isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-500 cursor-default' : ''}
                  `}
                >
                  {isCompleted ? '✓' : step.number}
                </button>
                <span
                  className={`mt-1.5 text-xs font-medium whitespace-nowrap ${
                    isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 -mt-5 ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
