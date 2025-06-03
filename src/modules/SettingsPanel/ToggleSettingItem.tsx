import React from 'react'
import {
	SettingItem,
	SettingItemControl,
	SettingItemDescription,
	SettingItemInfo,
	SettingItemName,
} from '../../components/SettingItem'

interface ToggleSettingItemProps {
	name: string
	description: string
	checked: boolean
	onChange: () => void
}

export const ToggleSettingItem: React.FC<ToggleSettingItemProps> = React.memo(
	({ name, description, checked, onChange }) => (
		<SettingItem className="mod-toggle">
			<SettingItemInfo>
				<SettingItemName>{name}</SettingItemName>
				<SettingItemDescription>{description}</SettingItemDescription>
			</SettingItemInfo>
			<SettingItemControl>
				<div
					className={`checkbox-container${checked ? ' is-enabled' : ''}`}
					onClick={onChange}
					role="switch"
					aria-checked={checked}
					tabIndex={0} // Make it focusable
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault()
							onChange()
						}
					}}
				>
					<input type="checkbox" checked={checked} readOnly tabIndex={-1} />
				</div>
			</SettingItemControl>
		</SettingItem>
	)
)
ToggleSettingItem.displayName = 'ToggleSettingItem'
