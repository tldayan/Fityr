import React from 'react'
import Styles from './CustomIconButton.module.css'
import { text } from 'stream/consumers'

type CustomIconButtonProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  onClick?: () => void
  className?: string
  iconColor?: string
  noBackground?: boolean
  text?: string
}

export default function CustomIconButton({ icon: Icon, onClick, className, iconColor, noBackground,text }: CustomIconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        ${className || ''} 
        ${Styles.primary_icon_button} 
        ${noBackground ? Styles.no_background : ''}
      `}
    >
      <Icon color={iconColor} width={22} height={22} />
      {text && <p className={Styles.buttonText}>{text}</p>}
    </button>
  )
}
