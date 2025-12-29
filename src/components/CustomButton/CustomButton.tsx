import React from 'react'
import Styles from './CustomButton.module.css'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

type CustomButtonProps = {
  title: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  onClick?: () => void
  className?: string
  disabled?: boolean
  loading?: boolean
  shadow?: boolean
}

export default function CustomButton({
  title,
  shadow,
  icon: Icon,
  onClick,
  loading,
  className,
  disabled
}: CustomButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${Styles.customButton} ${shadow ? Styles.shadow : ''} ${className || ''}`}
    >
      {loading && <LoadingSpinner themed noMargin size='small' />}
      {!loading && <span className={Styles.title}>{title}</span>}
    </button>
  )
}
