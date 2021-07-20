import React, { useState, useCallback, useRef } from 'react'
import { AutoComplete } from 'antd'
import { useClickAway } from 'ahooks'

import { ICommand } from '@/IType'

import styles from './index.less'

interface ICommandPaletteProps {
  setCmdPaletteVisible: (visible: boolean) => void
  commands: ICommand[]
  executCommand: (cmd: ICommand) => void
}

export function CommandPalette({ setCmdPaletteVisible, commands, executCommand }: ICommandPaletteProps) {
  const paletteRef = useRef<HTMLDivElement>(null)
  const [text, setText] = useState<string>('')
  const [options, setOptions] = useState<ICommand[]>(commands)

  const changeOptions = useCallback(
    (text: string) => {
      setText(text)
      if (!text) {
        setOptions(commands)
        return
      }
      setOptions(
        commands.filter(
          (cmd) => cmd.category.includes(text) || cmd.alias.includes(text) || cmd.description.includes(text)
        )
      )
    },
    [setText, setOptions, commands]
  )

  useClickAway(() => {
    setCmdPaletteVisible(false)
  }, paletteRef)

  return (
    <div
      ref={paletteRef}
      className={styles.cmdPalette}
      onKeyUp={(e) => {
        if (e.key === 'Escape') {
          setCmdPaletteVisible(false)
        }
      }}
    >
      <AutoComplete
        value={text}
        autoFocus
        open
        placeholder="Type to search Command..."
        style={{ width: '100%' }}
        onSearch={changeOptions}
        getPopupContainer={(trigger) => trigger.parentElement}
        onSelect={(e) => {
          setCmdPaletteVisible(false)
          const cmd = commands.find((c) => c.id === e)
          executCommand(cmd!)
        }}
        notFoundContent={<div style={{ color: '#3f3f3f' }}>No matching commands</div>}
      >
        {options.map((cmd) => {
          return (
            <AutoComplete.Option key={cmd.id} value={cmd.id}>
              <div className={styles.option}>
                <div style={{ fontWeight: 'bold', width: 70 }}>{cmd.category}: </div>
                <div style={{ maxWidth: 180, margin: '0 5px 0 5px' }}>{cmd.alias}</div>
                <div style={{ width: 20 }}>=</div>
                <div
                  className={styles.description}
                  style={{
                    width: '100%',
                  }}
                >
                  {cmd.description}
                </div>
              </div>
            </AutoComplete.Option>
          )
        })}
      </AutoComplete>
    </div>
  )
}
