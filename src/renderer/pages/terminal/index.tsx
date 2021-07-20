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
  const { workingTerminalRef, cmdPaletteVisible, commands, setCmdPaletteVisible, executCommand, setupOpeningListener } =
    useModel('useTerminalModel', (m) =>
      pick(
        m,
        'workingTerminalRef',
        'cmdPaletteVisible',
        'commands',
        'setCmdPaletteVisible',
        'executCommand',
        'setupOpeningListener'
      )
    )

  const id = useMemo(() => workingTerminalRef?.current?.id, [workingTerminalRef])

  const xtermDomContent = useMemo(() => {
    return <div ref={xtermElemRef} id={id} style={{ width: '100%', height: '100%' }} />

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useInit(workingTerminalRef, xtermElemRef.current, `${workingTerminalRef?.current?.id}`, 'terminal-resize')

  useResize(workingTerminalRef, { width: height }, 'terminal-resize')

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
