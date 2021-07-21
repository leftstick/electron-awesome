import React, { useRef, useMemo, useEffect } from 'react'
import { useModel } from 'umi'
import { useSize } from 'ahooks'
import { pick } from '@/helpers'
import { CommandPalette } from '@/components'
import { useResize, useInit } from '@/hooks'

import 'xterm/css/xterm.css'

function TerminalBox() {
  const xtermElemRef = useRef<HTMLDivElement>(null)
  const { width, height } = useSize(document.body)
  const { workingTerminal, cmdPaletteVisible, commands, setCmdPaletteVisible, executCommand, setupOpeningListener } =
    useModel('useTerminalModel', (m) =>
      pick(
        m,
        'workingTerminal',
        'cmdPaletteVisible',
        'commands',
        'setCmdPaletteVisible',
        'executCommand',
        'setupOpeningListener'
      )
    )

  const id = workingTerminal?.id
  const xtermElem = xtermElemRef.current

  const xtermDomContent = useMemo(() => {
    return <div ref={xtermElemRef} id={id} style={{ width: '100%', height: '100%' }} />
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useInit(workingTerminal, xtermElem, 'terminal-resize')

  useResize(workingTerminal, { width: height }, 'terminal-resize')

  useEffect(() => {
    return setupOpeningListener()
  }, [setupOpeningListener])

  return (
    <div style={{ width, height, paddingLeft: 10, paddingRight: 10 }}>
      {cmdPaletteVisible && (
        <CommandPalette commands={commands} setCmdPaletteVisible={setCmdPaletteVisible} executCommand={executCommand} />
      )}
      <div style={{ width: width! - 20, height: height! - 5, padding: 0, margin: 0 }}>{xtermDomContent}</div>
    </div>
  )
}

TerminalBox.title = 'Terminal => '

export default TerminalBox
