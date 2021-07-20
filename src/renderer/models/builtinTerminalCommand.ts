import { ICommand, ICommandCategory } from '@/IType'

export default [
  {
    id: 'create-new-snippet',
    category: ICommandCategory.Control,
    description: 'Create a new snippet',
    alias: 'createsnippet',
  },
  {
    id: 'delete-one-snippet',
    category: ICommandCategory.Control,
    description: 'Delete one snippet',
    alias: 'deletesnippet',
  },
  {
    id: 'increase-font-size',
    category: ICommandCategory.Control,
    description: 'Increase terminal font-size',
    alias: '+fontsize',
  },
  {
    id: 'decrease-font-size',
    category: ICommandCategory.Control,
    description: 'Decrease terminal font-size',
    alias: '-fontsize',
  },
] as ICommand[]
