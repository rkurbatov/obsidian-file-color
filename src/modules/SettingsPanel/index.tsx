import { Button } from 'components/Button'
import { AddCircleIcon } from 'components/icons/AddCircleIcon'
import { usePlugin } from 'hooks/usePlugin'
import { nanoid } from 'nanoid'
import React, { useEffect, useState, useCallback } from 'react'
import type { FileColorPluginSettings } from 'settings'
import {
	SettingItem,
	SettingItemControl,
	SettingItemInfo,
} from 'components/SettingItem'
import { SettingItemControlFull } from './SettingItemControlFull'
import { ToggleSettingItem } from './ToggleSettingItem'
import { PaletteColorItem } from './PaletteColorItem'

export type PaletteColor = FileColorPluginSettings['palette'][number]

export const SettingsPanel = () => {
	const plugin = usePlugin()

	const [palette, setPalette] = useState<PaletteColor[]>([
		...plugin.settings.palette,
	])

	type SettingKeys = keyof Pick<
		FileColorPluginSettings,
		'cascadeColors' | 'colorBackgroundFile' | 'colorBackgroundFolder'
	>
	const [options, setOptions] = useState({
		cascadeColors: plugin.settings.cascadeColors,
		colorBackgroundFile: plugin.settings.colorBackgroundFile,
		colorBackgroundFolder: plugin.settings.colorBackgroundFolder,
	})

	const [paletteChanged, setPaletteChanged] = useState<boolean>(false)

	useEffect(() => {
		if (palette.length !== plugin.settings.palette.length) {
			setPaletteChanged(true)
			return
		}

		const hasChanges = palette.some((color) => {
			const settingsColor = plugin.settings.palette.find(
				(sc) => sc.id === color.id
			)
			return (
				!settingsColor ||
				settingsColor.name !== color.name ||
				settingsColor.value !== color.value
			)
		})
		setPaletteChanged(hasChanges)
	}, [palette, plugin.settings.palette])

	const handleRemoveColor = useCallback((id: string) => {
		setPalette((prevPalette) => prevPalette.filter((c) => c.id !== id))
	}, [])

	const handleColorValueChange = useCallback((id: string, value: string) => {
		setPalette((prevPalette) =>
			prevPalette.map((c) => (c.id === id ? { ...c, value } : c))
		)
	}, [])

	const handleColorNameChange = useCallback((id: string, name: string) => {
		setPalette((prevPalette) =>
			prevPalette.map((c) => (c.id === id ? { ...c, name } : c))
		)
	}, [])

	const handleAddColor = useCallback(() => {
		setPalette((prevPalette) => [
			...prevPalette,
			{
				id: nanoid(),
				name: '',
				value: '#ffffff', // Default color
			},
		])
	}, [])

	const handleSavePalette = useCallback(() => {
		plugin.settings.palette = [...palette]
		plugin.settings.fileColors = plugin.settings.fileColors.filter(
			(fileColor) => palette.some((color) => fileColor.color === color.id)
		)
		plugin.saveSettings()
		plugin.generateColorStyles()
		plugin.applyColorStyles()
		setPaletteChanged(false)
	}, [plugin, palette])

	const handleRevertPalette = useCallback(() => {
		setPalette([...plugin.settings.palette])
		setPaletteChanged(false)
	}, [plugin])

	const handleToggleOption = useCallback(
		(optionKey: SettingKeys) => {
			setOptions((prevOptions) => {
				const newValue = !prevOptions[optionKey]
				plugin.settings[optionKey] = newValue // Обновляем настройки плагина
				plugin.saveSettings()
				plugin.applyColorStyles() // Применяем стили сразу
				return { ...prevOptions, [optionKey]: newValue }
			})
		},
		[plugin]
	)

	return (
		<div className="file-color-settings-panel">
			<h2>Palette</h2>
			{palette.length === 0 && (
				<SettingItem>
					<SettingItemInfo>
						<span>No colors in the palette.</span>
					</SettingItemInfo>
				</SettingItem>
			)}
			{palette.map((color) => (
				<PaletteColorItem
					key={color.id}
					color={color}
					onValueChange={handleColorValueChange}
					onNameChange={handleColorNameChange}
					onRemove={handleRemoveColor}
				/>
			))}
			<SettingItem>
				<SettingItemControlFull>
					<Button onClick={handleAddColor}>
						<AddCircleIcon />
						<span>Add Color</span>
					</Button>
				</SettingItemControlFull>
			</SettingItem>

			{paletteChanged && (
				<SettingItem className="file-color-settings-save">
					<SettingItemInfo>
						<span className="mod-warning">
							You have unsaved palette changes.
						</span>
					</SettingItemInfo>
					<SettingItemControl>
						<Button onClick={handleRevertPalette}>Revert changes</Button>
						<Button onClick={handleSavePalette} className="mod-cta">
							Save
						</Button>
					</SettingItemControl>
				</SettingItem>
			)}

			<h2>Options</h2>
			<ToggleSettingItem
				name="Cascade Colors"
				description="Folders will cascade their colors to sub-folders and notes, unless their colors are explicitly set."
				checked={options.cascadeColors}
				onChange={() => handleToggleOption('cascadeColors')}
			/>
			<ToggleSettingItem
				name="Color File Background"
				description="Color the background instead of the text of files."
				checked={options.colorBackgroundFile}
				onChange={() => handleToggleOption('colorBackgroundFile')}
			/>
			<ToggleSettingItem
				name="Color Folder Background"
				description="Color the background instead of the text of folders."
				checked={options.colorBackgroundFolder}
				onChange={() => handleToggleOption('colorBackgroundFolder')}
			/>
		</div>
	)
}
