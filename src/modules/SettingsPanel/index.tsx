import { Button } from 'components/Button'
import { AddCircleIcon } from 'components/icons/AddCircleIcon'
import { TrashIcon } from 'components/icons/TrashIcon'
import { usePlugin } from 'hooks/usePlugin'
import { nanoid } from 'nanoid'
import React, { useEffect, useState } from 'react'
import type { FileColorPluginSettings } from 'settings'
import {
	SettingItem,
	SettingItemName,
	SettingItemControl,
	SettingItemInfo,
	SettingItemDescription,
} from 'components/SettingItem'
import { SettingItemControlFull } from './SettingItemControlFull'
import { WideTextInput } from './WideTextInput'

type Color = FileColorPluginSettings['palette'][number]

export const SettingsPanel = () => {
	const plugin = usePlugin()
	const [palette, setPalette] = useState<FileColorPluginSettings['palette']>(
		plugin.settings.palette
	)
	const [cascadeColors, setCascadeColors] = useState<
		FileColorPluginSettings['cascadeColors']
	>(plugin.settings.cascadeColors)
	const [colorBackgroundFile, setColorBackgroundFile] = useState<
		FileColorPluginSettings['colorBackgroundFile']
	>(plugin.settings.colorBackgroundFile)
	const [colorBackgroundFolder, setColorBackgroundFolder] = useState<
		FileColorPluginSettings['colorBackgroundFolder']
	>(plugin.settings.colorBackgroundFolder)
	const [changed, setChanged] = useState<boolean>(false)

	useEffect(() => {
		if (palette.length !== plugin.settings.palette.length) {
			setChanged(true)
			return
		}

		setChanged(
			palette.some((color) => {
				const settingsColor = plugin.settings.palette.find(
					(settingsColor) => settingsColor.id === color.id
				)

				if (
					!settingsColor ||
					settingsColor.name !== color.name ||
					settingsColor.value !== color.value
				) {
					return true
				}
			})
		)
	}, [plugin, palette])

	const onRemoveColor = (color: Color, colorIndex: number) => {
		setPalette(palette.filter((paletteColor) => paletteColor.id !== color.id))
	}

	const onColorValueChange = (color: Color, value: string) => {
		setPalette(
			palette.map((paletteColor) => {
				if (paletteColor.id === color.id) {
					return { ...color, value }
				}
				return paletteColor
			})
		)
	}

	const onColorNameChange = (color: Color, name: string) => {
		setPalette(
			palette.map((paletteColor) => {
				if (paletteColor.id === color.id) {
					return { ...color, name }
				}
				return paletteColor
			})
		)
	}

	const onAddColor = () => {
		setPalette([
			...palette,
			{
				id: nanoid(),
				name: '',
				value: '#ffffff',
			},
		])
	}

	const onSave = () => {
		plugin.settings.palette = palette
		plugin.settings.fileColors = plugin.settings.fileColors.filter(
			(fileColor) => palette.find((color) => fileColor.color === color.id)
		)
		plugin.saveSettings()
		plugin.generateColorStyles()
		plugin.applyColorStyles()
		setChanged(false)
	}

	const onRevert = () => {
		setPalette(plugin.settings.palette)
		setChanged(false)
	}

	const onChangeCascadeColors = () => {
		setCascadeColors(!cascadeColors)
		plugin.settings.cascadeColors = !plugin.settings.cascadeColors
		plugin.saveSettings()
		plugin.applyColorStyles()
	}

	const onChangeColorBackgroundFile = () => {
		setColorBackgroundFile(!colorBackgroundFile)
		plugin.settings.colorBackgroundFile = !plugin.settings.colorBackgroundFile
		plugin.saveSettings()
		plugin.applyColorStyles()
	}

	const onChangeColorBackgroundFolder = () => {
		setColorBackgroundFolder(!colorBackgroundFolder)
		plugin.settings.colorBackgroundFolder =
			!plugin.settings.colorBackgroundFolder
		plugin.saveSettings()
		plugin.applyColorStyles()
	}

	return (
		<div className="file-color-settings-panel">
			<h2>Palette</h2>
			{palette.length < 1 && <span>No colors in the palette</span>}
			{palette.map((color, colorIndex) => (
				<SettingItem key={color.id}>
					<SettingItemControlFull>
						<input
							type="color"
							value={color.value}
							onChange={(e) => onColorValueChange(color, e.target.value)}
						/>
						<WideTextInput
							type="text"
							placeholder="Color name"
							value={color.name}
							onChange={(e) => onColorNameChange(color, e.target.value)}
						/>
						<Button onClick={() => onRemoveColor(color, colorIndex)}>
							<TrashIcon />
						</Button>
					</SettingItemControlFull>
				</SettingItem>
			))}
			<SettingItem>
				<SettingItemControlFull>
					<Button onClick={onAddColor}>
						<AddCircleIcon />
						<span>Add Color</span>
					</Button>
				</SettingItemControlFull>
			</SettingItem>
			{changed && (
				<SettingItem className="file-color-settings-save">
					<SettingItemInfo>
						<span className="mod-warning">
							You have unsaved palette changes.
						</span>
					</SettingItemInfo>
					<SettingItemControl>
						<Button onClick={onRevert}>Revert changes</Button>
						<Button onClick={onSave}>Save</Button>
					</SettingItemControl>
				</SettingItem>
			)}

			<h2>Options</h2>
			<SettingItem className="mod-toggle">
				<SettingItemInfo>
					<SettingItemName>Cascade Colors</SettingItemName>
					<SettingItemDescription>
						Folders will cascade their colors to sub-folders and notes, unless
						their colors are explicitly set.
					</SettingItemDescription>
				</SettingItemInfo>

				<SettingItemControl>
					<div
						className={
							'checkbox-container' + (cascadeColors ? ' is-enabled' : '')
						}
						onClick={onChangeCascadeColors}
					>
						<input type="checkbox"></input>
					</div>
				</SettingItemControl>
			</SettingItem>

			<SettingItem className="mod-toggle">
				<SettingItemInfo>
					<SettingItemName>Color File Background</SettingItemName>
					<SettingItemDescription>
						Color the background instead of the text of files.
					</SettingItemDescription>
				</SettingItemInfo>

				<SettingItemControl>
					<div
						className={
							'checkbox-container' + (colorBackgroundFile ? ' is-enabled' : '')
						}
						onClick={onChangeColorBackgroundFile}
					>
						<input type="checkbox"></input>
					</div>
				</SettingItemControl>
			</SettingItem>

			<SettingItem className="mod-toggle">
				<SettingItemInfo>
					<SettingItemName>Color Folder Background</SettingItemName>
					<SettingItemDescription>
						Color the background instead of the text of folders.
					</SettingItemDescription>
				</SettingItemInfo>

				<SettingItemControl>
					<div
						className={
							'checkbox-container' +
							(colorBackgroundFolder ? ' is-enabled' : '')
						}
						onClick={onChangeColorBackgroundFolder}
					>
						<input type="checkbox"></input>
					</div>
				</SettingItemControl>
			</SettingItem>
		</div>
	)
}
