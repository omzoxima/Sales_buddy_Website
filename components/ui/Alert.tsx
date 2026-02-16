import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  onClose?: () => void
}

export function Alert({ 
  className, 
  variant = 'info', 
  title, 
  onClose, 
  children, 
  ...props 
}: AlertProps) {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: Info,
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: CheckCircle,
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: AlertCircle,
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: XCircle,
    },
  }
  
  const { container, icon: Icon } = variants[variant]
  
  return (
    <div
      className={cn(
        'flex gap-3 p-4 border rounded-lg',
        container,
        className
      )}
      role="alert"
      {...props}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <p className="font-medium mb-1">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 hover:opacity-70">
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
