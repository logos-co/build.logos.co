import React from 'react'
import Link from '@components/Link'
import cx from 'classnames'
import { ArrowRight } from 'lucide-react'

const Button = ({
	className = '',
	children = null,
	to = undefined,
	onClick = undefined,
	icon = undefined,
	iconPosition = 'left',
	label = undefined,
	style = {},
	size = false,
	shape = false,
	disabled = false,
	name = undefined,
	type = undefined,
	title = undefined,
	as = undefined,
	target = undefined,
	arrow = false,
	...props
}) => {
	let childString = undefined
	if (typeof children === 'string') {
		childString = children
	}
	
	const hideLabel = shape === 'square' || shape === 'circle'
	const LinkEl = as || Link

	if (arrow) {
		icon = <div className='pt-[1px]'><ArrowRight size={15} /></div>
		iconPosition = 'right'
	}

	return (
		<LinkEl
			className={cx('button', className, shape, size, disabled && 'disabled')}
			to={to}
			onClick={onClick}
			disabled={disabled}
			style={style}
			title={title || name || childString || undefined}
			name={name || title || childString || undefined}
			aria-label={name || title || childString || undefined}
			target={target}
			{...props}
		>
			<div className="button-content flex gap-x-[.75em] items-center justify-between">
				{icon && iconPosition !== 'right' && <div className='icon-wrapper'>{icon}</div>}
				{(children || label) && !hideLabel && (
					<div className="button-label whitespace-nowrap">
						{children || label}
					</div>
				)}
				{icon && iconPosition === 'right' && <div className='icon-wrapper'>{icon}</div>}
			</div>
		</LinkEl>
	)
}

export default Button
