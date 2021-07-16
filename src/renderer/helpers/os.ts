import os from 'os'

export const shell: string = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL']!
