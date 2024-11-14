import Link from 'next/link'
import clsx from 'clsx'

const baseStyles = {
  solid:
    'group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
  outline:
    'group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none',
}

const variantStyles = {
  solid: {
    slate:
      'bg-primary-400 disabled:opacity-75 disabled:bg-gray-500 disabled:text-gray-800 text-secondary-900 hover:bg-primary-700 hover:text-secondary-700 active:bg-primary-800 active:text-primary-300 focus-visible:outline-primary-400',
    blue: 'bg-primary-400 disabled:opacity-75 disabled:bg-gray-500 disabled:text-gray-800 text-secondary-900 hover:bg-primary-700 hover:text-secondary-700 active:bg-primary-800 active:text-primary-300 focus-visible:outline-primary-400',
    white:
      'bg-white disabled:opacity-75 disabled:bg-gray-500 disabled:text-gray-800 text-secondary-900 hover:bg-primary-50 active:bg-primary-200 active:text-primary-600 focus-visible:outline-white',
  },
  outline: {
    slate:
      'ring-primary-200 disabled:opacity-75 disabled:bg-gray-500 disabled:text-gray-800 text-primary-300 hover:text-primary-900 hover:ring-primary-300 active:bg-primary-100 active:text-primary-600 focus-visible:outline-primary-600 focus-visible:ring-primary-300',
    white:
      'ring-primary-400 disabled:opacity-75 disabled:bg-gray-500 disabled:text-gray-800 text-secondary-400 hover:ring-primary-500 active:ring-primary-700 active:text-primary-400 focus-visible:outline-white',
  },
}

type ButtonProps = (
  | {
      variant?: 'solid'
      color?: keyof typeof variantStyles.solid
    }
  | {
      variant: 'outline'
      color?: keyof typeof variantStyles.outline
    }
) &
  (
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'color'>
    | (Omit<React.ComponentPropsWithoutRef<'button'>, 'color'> & {
        href?: undefined
      })
  )

export function Button({ className, ...props }: ButtonProps) {
  props.variant ??= 'solid'
  props.color ??= 'slate'

  className = clsx(
    baseStyles[props.variant],
    props.variant === 'outline'
      ? variantStyles.outline[props.color]
      : props.variant === 'solid'
        ? variantStyles.solid[props.color]
        : undefined,
    className,
  )

  return typeof props.href === 'undefined' ? (
    <button className={className} {...props} />
  ) : (
    <Link className={`text-secondary-950 ${className}`} {...props} />
  )
}
