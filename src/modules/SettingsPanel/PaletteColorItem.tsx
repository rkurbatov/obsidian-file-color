import React from 'react'
import { SettingItem } from '../../components/SettingItem'
import { SettingItemControlFull } from './SettingItemControlFull'
import { WideTextInput } from './WideTextInput'
import { Button } from '../../components/Button'
import { TrashIcon } from '../../components/icons/TrashIcon'

import type { PaletteColor } from './index'

interface PaletteColorItemProps {
	color: PaletteColor
	onValueChange: (id: string, value: string) => void
	onNameChange: (id: string, name: string) => void
	onRemove: (id: string) => void
}

export const PaletteColorItem: React.FC<PaletteColorItemProps> = React.memo(
	({ color, onValueChange, onNameChange, onRemove }) => (
		<SettingItem>
			<SettingItemControlFull>
				<input
					type="color"
					value={color.value}
					onChange={(e) => onValueChange(color.id, e.target.value)}
				/>
				<WideTextInput
					type="text"
					placeholder="Color name"
					value={color.name}
					onChange={(e) => onNameChange(color.id, e.target.value)}
				/>
				<Button onClick={() => onRemove(color.id)} aria-label="Remove color">
					<TrashIcon />
				</Button>
			</SettingItemControlFull>
		</SettingItem>
	)
)
PaletteColorItem.displayName = 'PaletteColorItem'
