export type FileColorPluginSettings = {
  cascadeColors: boolean
  colorBackgroundFile: boolean
  colorBackgroundFolder: boolean
  palette: Array<{
    id: string
    name: string
    value: string
  }>
  fileColors: Array<{
    path: string
    color: string
  }>
}

export const defaultSettings: FileColorPluginSettings = {
  cascadeColors: false,
  colorBackgroundFile: false,
  colorBackgroundFolder: false,
  palette: [],
  fileColors: [],
}
