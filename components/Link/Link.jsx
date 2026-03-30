"use client"

import React from 'react'
import { useAppContext } from '@/context/AppContext'
import NextLink from 'next/link'

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
	onClick = undefined,
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

	const clickHandler = (e) => {
		if (onClick) {
			onClick(e)
		}
		if (popup?.slug) {
			toggleModal(popup.slug)
		}
	}

	href = href || to || ''
	const hasHref = Boolean(href)

	let LinkEl = NextLink
	let linkProps = {
		href: href || '',
		scroll: !href.startsWith('#'),
		target: target,
		...(target === '_blank' && { rel: 'noopener noreferrer' }),
	}

	if (as) {
		LinkEl = as
		linkProps = props
	} else if (hasHref && (onClick || popup)) {
		linkProps = {
			...linkProps,
			onClick: clickHandler,
		}
	} else if (!hasHref && (onClick || popup)) {
		LinkEl = 'button'
		linkProps = {
			type: 'button',
			onClick: clickHandler,
		}
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
