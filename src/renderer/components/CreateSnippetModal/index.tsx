import React, { useCallback } from 'react'
import ReactDOM from 'react-dom'
import { Modal, Input, Form } from 'antd'
import { useLocalStorageState } from 'ahooks'
import { IExecuteResult, ICommand } from '@/IType'

export interface ICreateSnippetModalProps {
  storageKey: string
  visible: boolean
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onOk: (e: { alias: string; snippetCode: string }) => void
}

export function CreateSnippetModal({ storageKey, visible, onCancel, onOk }: ICreateSnippetModalProps) {
  const [customizedCmds] = useLocalStorageState<ICommand[]>(storageKey, [])
  const [form] = Form.useForm()

  const submit = useCallback(() => {
    form.validateFields().then((res) => {
      onOk({
        alias: res.alias,
        snippetCode: res.snippetCode,
      })
    })
  }, [form, onOk])

  return (
    <Modal
      title="Create Customized Snippet"
      visible={visible}
      onCancel={onCancel}
      okButtonProps={{ type: 'primary', htmlType: 'submit' }}
      onOk={submit}
    >
      <br />
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="Alias"
          name="alias"
          rules={[
            { required: true, message: 'alias is required!' },
            { max: 20, message: 'alias length cannot exceed 20' },
            {
              validator: (rule, value, cb) => {
                if (customizedCmds.some((c) => c.alias === value)) {
                  return cb(`alias [${value}] has been used, try another one`)
                }
                cb()
              },
            },
          ]}
        >
          <Input autoFocus />
        </Form.Item>

        <Form.Item
          label="Snippet Code"
          name="snippetCode"
          rules={[
            { required: true, message: 'Snippet Code is required!' },
            { max: 150, message: 'description length cannot exceed 150' },
          ]}
        >
          <Input
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                submit()
              }
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export function showCreateSnippetModal(storageKey: string): IExecuteResult<{ alias: string; snippetCode: string }> {
  const div = document.createElement('div')

  document.body.appendChild(div)

  const destroy = () => {
    ReactDOM.unmountComponentAtNode(div)
  }

  const value = new Promise<{ alias: string; snippetCode: string }>((resolve) => {
    ReactDOM.render(<CreateSnippetModal storageKey={storageKey} visible onCancel={destroy} onOk={resolve} />, div)
  })

  return {
    destroy,
    value,
  }
}
