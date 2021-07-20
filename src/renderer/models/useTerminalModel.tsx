import { useState, useRef, useCallback } from 'react'
import { ipcRenderer } from 'electron'
import { useLocalStorageState } from 'ahooks'
import x, { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { useTerminalCommand } from '@/hooks'
import { ICommand, ITerminalRef } from '@/IType'

import builtinCommands from './builtinTerminalCommand'

function useTerminalModel() {
  const [customizedCmds, setCustomizedCmds] = useLocalStorageState<ICommand[]>('custom-cmds', [])
  const [terminalPreference, setTerminalPreference] = useLocalStorageState<x.ITerminalOptions>('terminal-preference', {
    fontSize: 14,
  })
  const [cmdPaletteVisible, setCmdPaletteVisible] = useState<boolean>()
  const workingTerminalRef = useRef<ITerminalRef>()

  const setupOpeningListener = useCallback(() => {
    ipcRenderer.on('open-terminal-in-view', (e, id) => {
      // xterm addon
      const fitAddon = new FitAddon()

      const terminal: ITerminalRef = {
        id: id,
        xterm: new Terminal({
          fontSize: terminalPreference.fontSize,
        }),
        addson: {
          fit: fitAddon,
        },
      }

      // load addon
      terminal.xterm.loadAddon(fitAddon)

      // terminal: send user input to pty
      terminal.xterm.onData((data) => {
        ipcRenderer.send('write-to-pty', id, data)
      })

      workingTerminalRef.current = terminal
    })

    ipcRenderer.on('open-cmd-palette', (e) => {
      setCmdPaletteVisible(true)
    })

    // terminal: get pty response back
    ipcRenderer.on('write-to-xterm', (e, id: string, data: any) => {
      if (workingTerminalRef.current) {
        workingTerminalRef.current.xterm.write(data)
      }
    })

    return () => {
      ipcRenderer.removeAllListeners('open-terminal-in-view')
      ipcRenderer.removeAllListeners('write-to-xterm')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workingTerminalRef, setCmdPaletteVisible])

  const { commands, addCustomizedCmd, removeCustomizedCmd, executCommand } = useTerminalCommand({
    workingTerminal: workingTerminalRef,
    builtinCommands,
    customizedCmds,
    setCustomizedCmds,
    terminalPreference,
    setTerminalPreference,
    ptyWriteChannel: 'write-to-pty',
    storageKey: 'custom-cmds',
  })

  return {
    setupOpeningListener,
    workingTerminalRef,
    cmdPaletteVisible,
    setCmdPaletteVisible,
    commands,
    addCustomizedCmd,
    removeCustomizedCmd,
    executCommand,
  }
}

export default useTerminalModel
