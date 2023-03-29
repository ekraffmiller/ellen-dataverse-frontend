import { DropdownButton as DropdownButtonBS } from 'react-bootstrap'
import { ReactNode } from 'react'
import './dropdown-button.scss'
import styles from './DropdownButton.module.scss'
import { Icon } from '../icon.enum'

type DropdownButtonVariant = 'primary' | 'secondary' | 'tertiary'

interface DropdownButtonProps {
  id: string
  title: string
  variant?: DropdownButtonVariant
  icon?: Icon
  withSpacing?: boolean
  children: ReactNode
}

export function DropdownButton({
  id,
  title,
  variant = 'primary',
  icon,
  withSpacing,
  children
}: DropdownButtonProps) {
  return (
    <DropdownButtonBS
      className={`${styles[variant]} ${withSpacing ? styles.spacing : ''}`}
      id={id}
      title={
        <>
          {icon && <span className={`${styles.icon} ${icon}`} role="img" aria-label={icon}></span>}
          {title}
        </>
      }
      variant={variant}>
      {children}
    </DropdownButtonBS>
  )
}