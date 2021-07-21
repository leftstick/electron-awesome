import { useEffect } from 'react'
import { ipcRenderer } from 'electron'
import { useDebounceFn } from 'ahooks'
import { IOptionalSize, ITerminalRef } from '@/IType'

type IPtyResizeChannel = 'terminal-resize'

export function useResize(
  workingTerminal: ITerminalRef | undefined,
  size: IOptionalSize,
  ptyResizeChannel: IPtyResizeChannel
) {
  const { xterm, addson, id } = workingTerminal || {}

  const { run: resize } = useDebounceFn(
    (xterm, addson, size, id) => {
      if (xterm && addson && size.width && id) {
        addson.fit.fit()
        ipcRenderer.send(
          ptyResizeChannel,
          { id },
          {
            cols: xterm.cols,
            rows: xterm.rows,
          }
        )
      }
    },
    {
      wait: 250,
    }
  )

  useEffect(() => {
    resize(xterm, addson, size, id)
  }, [resize, xterm, addson, size, id])

  return null
}

export function useInit(
  workingTerminal: ITerminalRef | undefined,
  xtermElem: HTMLDivElement | null,
  ptyResizeChannel: IPtyResizeChannel
) {
  const { xterm, addson, id } = workingTerminal || {}

  useEffect(() => {
    if (xtermElem && xterm && addson) {
      console.log('run')
      xterm.open(xtermElem)
      xterm.focus()
      addson.fit.fit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xterm, xtermElem])

  useEffect(() => {
    if (id) {
      window.document.title = `Terminal => ${id}`
    }
  }, [id])

  useEffect(() => {
    if (xterm && id) {
      ipcRenderer.send(
        ptyResizeChannel,
        {
          id,
        },
        {
          cols: xterm.cols,
          rows: xterm.rows,
        }
      )
    }
  }, [xterm, ptyResizeChannel, id])

  return null
}
