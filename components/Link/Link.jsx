"use client"

import React from 'react'
import { useAppContext } from '@/context/AppContext'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

const Link = ({
	to = undefined,
	href = undefined,
	target = undefined,
	children = null,
	label = undefined,
	className = '',
	name = undefined,
	title = undefined,
	popup = undefined,
	onClick = false,
	transition = true,
	style = {},
	as = undefined,
	...props
}) => {
	const { toggleModal } = useAppContext() || {}
	let childString = undefined
	if (typeof children === 'string') {
		childString = children
	}

	let ariaLabel = name || title || childString || undefined
	if (target === '_blank') {
		ariaLabel = (name || title || childString) + ' - Open in new tab'
	}

	const clickHandler = () => {
		if (onClick) {
			onClick()
		}
		if (popup?.slug) {
			toggleModal(popup.slug)
		}
	}

	let LinkEl = NextLink
	href = href || to || ''

	let linkProps = {
		href: href || to || '',
		scroll: !(href || '').startsWith('#'),
		target: target,
		...(target === '_blank' && { rel: 'noopener noreferrer' }),
	}
	if (onClick || popup) {
		LinkEl = 'button'
		linkProps = {
			onClick: clickHandler,
			className: className + ' cursor-pointer'
		}
	}

	if (as) {
		LinkEl = as
		linkProps = props
	}

	return (
		<LinkEl
			{...linkProps}
			className={className + ' cursor-pointer'}
			title={title || name || childString || undefined}
			name={name || title || childString || undefined}
			aria-label={ariaLabel}
			style={style}
		>
			{children || label}
		</LinkEl>
	)
}

export default Link
