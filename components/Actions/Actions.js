import React from 'react'
import { useRouter } from 'next/router'
import TextLink from '@components/TextLink'
import Button from '@components/Button'
import { getLinkProps, slugify } from '@utils/helpers'
import { trackEvent } from '@context/UmamiProvider'
import cx from 'classnames'
import { DynamicIcon } from 'lucide-react/dynamic'

const getUmamiEventName = (action) => {
	const explicit =
		typeof action.umamiEventName === 'string' && action.umamiEventName.trim()
	const fromTitle = slugify(action.title || 'cta').replace(/-/g, '_')
	return explicit || fromTitle || 'click'
}

const Actions = ({
	actions,
	className,
	alignment = 'left',
	arrows = true,
	alwaysButton = false,
	themes = []
}) => {
	const { asPath } = useRouter()

	if (!actions || actions.length < 1) {
		return false
	}

	let alignmentClass = 'justify-start'
	if (alignment === 'center') {
		alignmentClass = 'justify-center'
	}

	const handleTrackedClick = (action) => () => {
		if (!action.trackUmami) return
		const source = action.umamiUseCurrentPath
			? asPath
			: action.umamiEventSource || ''
		trackEvent(getUmamiEventName(action), { source })
	}

	return (
		<div
			className={cx(
				className,
				alignmentClass,
				'flex flex-wrap gap-gutter items-baseline'
			)}
		>
			{actions.map((action, index) => {
				if (!action.title) {
					return false
				}
				if (action._type === 'button' || alwaysButton) {
					return (
						<Button
							key={action._key}
							disabled={action.disabled}
							arrow={!action.icon}
							icon={<DynamicIcon name={action.icon} size={15} />}
							iconPosition='right'
							className={cx(
								'!m-0',
								themes[index] || action.theme
							)}
							{...getLinkProps(action)}
							onClick={
								action.trackUmami ? handleTrackedClick(action) : undefined
							}
						>
							{action.title}
						</Button>
					)
				} else {
					return (
						<TextLink
							key={action._key}
							{...getLinkProps(action)}
							className='!m-0'
							arrow={arrows}
							onClick={
								action.trackUmami ? handleTrackedClick(action) : undefined
							}
						>
							{action.title}
						</TextLink>
					)
				}
			})}
		</div>
	)
}

export default Actions
