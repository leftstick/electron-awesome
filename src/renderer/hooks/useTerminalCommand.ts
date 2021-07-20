import { useMemo, useCallback } from 'react'
import { ipcRenderer } from 'electron'
import x from 'xterm'
import { IFuncUpdater } from 'ahooks/es/createUseStorageState'
import { makeid } from '@/helpers'
import { showCreateSnippetModal, showDeleteSnippetModal } from '@/components'
import { ICommand, ICommandCategory, ITerminalRef } from '@/IType'

interface IUseTerminalCommandProps {
  workingTerminal: React.MutableRefObject<ITerminalRef | undefined>
  builtinCommands: ICommand[]
  customizedCmds: ICommand[]
  setCustomizedCmds: (value: ICommand[] | IFuncUpdater<ICommand[]>) => void
  terminalPreference: x.ITerminalOptions
  setTerminalPreference: (value: x.ITerminalOptions) => void
  ptyWriteChannel: 'write-to-pty'
  storageKey: 'custom-cmds'
}

export function useTerminalCommand({
  workingTerminal,
  customizedCmds,
  builtinCommands,
  setCustomizedCmds,
  terminalPreference,
  setTerminalPreference,
  ptyWriteChannel,
  storageKey,
}: IUseTerminalCommandProps) {
  const commands = useMemo(() => {
    return [...customizedCmds, ...builtinCommands]
  }, [builtinCommands, customizedCmds])

  const addCustomizedCmd = useCallback(
    (cmd: ICommand) => {
      if (!workingTerminal) {
        return
      }
      setCustomizedCmds((cmds) => [...cmds!, cmd])
    },
    [setCustomizedCmds, workingTerminal]
  )

  const removeCustomizedCmd = useCallback(
    (id: string) => {
      setCustomizedCmds((cmds) => cmds!.filter((cmd) => cmd.id !== id))
    },
    [setCustomizedCmds]
  )

  const executCommand = useCallback(
    (command: ICommand) => {
      if (command.id === 'create-new-snippet') {
        const model = showCreateSnippetModal(storageKey)
        model.value.then((res) => {
          addCustomizedCmd({
            id: makeid(8),
            category: ICommandCategory.Snippet,
            description: res.snippetCode,
            alias: res.alias,
          })

          model.destroy()
        })
        return
      }
      if (command.id === 'delete-one-snippet') {
        const model = showDeleteSnippetModal(storageKey)
        model.value.then((id) => {
          removeCustomizedCmd(id)

          model.destroy()
        })
        return
      }
      if (command.id === 'increase-font-size') {
        if (workingTerminal.current && terminalPreference.fontSize! < 100) {
          setTerminalPreference({
            ...terminalPreference,
            fontSize: terminalPreference.fontSize! + 1,
          })
          workingTerminal.current.xterm.setOption('fontSize', terminalPreference.fontSize! + 1)
          workingTerminal.current.addson.fit.fit()
        }
        return
      }
      if (command.id === 'decrease-font-size') {
        if (workingTerminal.current && terminalPreference.fontSize! > 10) {
          setTerminalPreference({
            ...terminalPreference,
            fontSize: terminalPreference.fontSize! - 1,
          })
          workingTerminal.current.xterm.setOption('fontSize', terminalPreference.fontSize! - 1)
          workingTerminal.current.addson.fit.fit()
        }
        return
      }

      if (command.category === ICommandCategory.Snippet) {
        if (workingTerminal.current) {
          ipcRenderer.send(ptyWriteChannel, workingTerminal.current.id, command.description)
          workingTerminal.current.xterm.focus()
        }
      }
    },
    [
      addCustomizedCmd,
      workingTerminal,
      removeCustomizedCmd,
      terminalPreference,
      setTerminalPreference,
      storageKey,
      ptyWriteChannel,
    ]
  )

  return {
    commands,
    addCustomizedCmd,
    removeCustomizedCmd,
    executCommand,
  }
}
