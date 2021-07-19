import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

export enum IBingSearchStatus {
  INITIAL = 'INITIAL',
  SEARCHING = 'SEARCHING',
  SEARCH_DONE = 'SEARCH_DONE',
}

export interface IBing {
  title: string
  description: string
  link: string
}

export interface ISize {
  width: number
  height: number
}

export interface IOptionalSize {
  width?: number
  height?: number
}

export interface IAlias {
  [key: string]: string
}

export interface ISSHCommand {
  wait: null | string
  exec: string
}

export interface IXterm {
  xterm: Terminal
  addson: {
    fit: FitAddon
  }
}

export enum ICommandCategory {
  Control = 'Control',
  Snippet = 'Snippet',
}

export interface ICommand {
  id: string
  category: ICommandCategory
  description: string
  alias: string
}

export interface ITerminalPreference {
  fontSize: number
}
