import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import { Modal, Form, Select } from 'antd'
import { useLocalStorageState } from 'ahooks'
import { IExecuteResult, ICommand } from '@/IType'

export interface IDeleteSnippetModalProps {
  visible: boolean
  storageKey: string
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onOk: (id: string) => void
}

export function DeleteSnippetModal({ visible, storageKey, onCancel, onOk }: IDeleteSnippetModalProps) {
  const [customizedCmds] = useLocalStorageState<ICommand[]>(storageKey, [])
  const cmdOptions = useMemo(
    () => customizedCmds.map((c) => ({ label: `${c.category}: ${c.alias} ${c.description}`, value: c.id })),
    [customizedCmds]
  )
  const [form] = Form.useForm<{ code: string }>()

  return (
    <Modal
      title="Delete Customized Snippet"
      visible={visible}
      onCancel={onCancel}
      okButtonProps={{ type: 'primary', htmlType: 'submit', danger: true }}
      cancelText="Close"
      okText="Delete"
      onOk={() => {
        form.validateFields().then((values) => {
          onOk(values.code)
        })
      }}
    >
      <br />
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={(values) => {
          onOk(values.code)
        }}
      >
        <Form.Item label="Snippet Code" name="code" rules={[{ required: true, message: 'Snippet Code is required!' }]}>
          <Select
            autoFocus
            filterOption={(input, option) => {
              return !!option?.label?.toString().toLowerCase().includes(input)
            }}
          >
            {cmdOptions.map((c) => {
              return (
                <Select.Option key={c.value} value={c.value}>
                  {c.label}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export function showDeleteSnippetModal(storageKey: string): IExecuteResult<string> {
  const div = document.createElement('div')

  document.body.appendChild(div)

  const destroy = () => {
    ReactDOM.unmountComponentAtNode(div)
  }

  const value = new Promise<string>((resolve) => {
    ReactDOM.render(<DeleteSnippetModal storageKey={storageKey} visible onCancel={destroy} onOk={resolve} />, div)
  })

  return {
    destroy,
    value,
  }
}
