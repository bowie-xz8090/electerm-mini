import { useEffect, useMemo, useState } from 'react'
import { Button, Input, Tag } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  EditOutlined,
  PlayCircleOutlined
} from '@ant-design/icons'
import classnames from 'classnames'
import { copy } from '../../common/clipboard'

const riskTagProps = {
  read_only: { color: 'blue', label: 'read_only' },
  changes_files: { color: 'gold', label: 'changes_files' },
  network: { color: 'orange', label: 'network' },
  privileged: { color: 'red', label: 'privileged' },
  destructive: { color: 'magenta', label: 'destructive' },
  unknown: { color: 'default', label: 'unknown' }
}

const statusTagProps = {
  pending: { color: 'gold', label: 'pending' },
  ready: { color: 'green', label: 'ready' },
  error: { color: 'red', label: 'error' },
  'config-missing': { color: 'red', label: 'config-missing' }
}

export default function TerminalSmartShellOverlay ({
  proposal,
  onExecute,
  onSave,
  onReject
}) {
  const [editing, setEditing] = useState(false)
  const [draftCommand, setDraftCommand] = useState('')

  useEffect(() => {
    if (!proposal) {
      return
    }
    const initialCommand = String(proposal.editableCommand || proposal.command || '')
    setDraftCommand(initialCommand)
    setEditing(!initialCommand.trim() && proposal.status !== 'pending')
  }, [proposal?.id, proposal?.command, proposal?.editableCommand, proposal?.status])

  const command = editing ? draftCommand : String(proposal?.command || '')
  const trimmedCommand = command.trim()
  const canExecute = !editing && !!trimmedCommand && proposal?.status !== 'pending'

  const riskTag = riskTagProps[proposal?.risk] || riskTagProps.unknown
  const statusTag = statusTagProps[proposal?.status] || statusTagProps.ready
  const message = proposal?.message || (proposal?.status === 'pending'
    ? 'AI 正在分析请求…'
    : 'No command was generated.')
  const skill = proposal?.skill || 'linux'

  const notes = useMemo(() => {
    return Array.isArray(proposal?.notes) ? proposal.notes.filter(Boolean) : []
  }, [proposal?.notes])

  if (!proposal) {
    return null
  }

  function handleCopy () {
    copy(trimmedCommand || proposal.command || proposal.prompt || '')
  }

  function handleModify () {
    setEditing(true)
  }

  function handleCancelEdit () {
    setDraftCommand(String(proposal.command || ''))
    setEditing(false)
  }

  function handleSave () {
    onSave?.(draftCommand)
    setEditing(false)
  }

  function handleEditorKeyDown (e) {
    if (e.key === 'Escape') {
      e.preventDefault()
      handleCancelEdit()
    }
  }

  let editAction
  if (editing) {
    editAction = (
      <Button
        size='small'
        icon={<CheckOutlined />}
        onClick={handleSave}
      >
        保存
      </Button>
    )
  } else {
    editAction = (
      <Button
        size='small'
        icon={<EditOutlined />}
        onClick={handleModify}
        disabled={proposal.status === 'pending'}
      >
        修改
      </Button>
    )
  }

  let commandBlock
  if (editing) {
    commandBlock = (
      <Input.TextArea
        value={draftCommand}
        onChange={(e) => setDraftCommand(e.target.value)}
        onKeyDown={handleEditorKeyDown}
        autoSize={{ minRows: 3, maxRows: 8 }}
        className='terminal-smart-shell-editor'
      />
    )
  } else {
    commandBlock = (
      <pre
        className={classnames('terminal-smart-shell-command', {
          empty: !trimmedCommand
        })}
      >
        {trimmedCommand || 'No command was generated.'}
      </pre>
    )
  }

  return (
    <div className='terminal-smart-shell-overlay'>
      <div className='terminal-smart-shell-card'>
        <div className='terminal-smart-shell-head'>
          <div className='terminal-smart-shell-title'>
            是否同意执行以下命令并查看输出?
          </div>
          <div className='terminal-smart-shell-buttons'>
            {editAction}
            <Button
              size='small'
              type='primary'
              icon={<PlayCircleOutlined />}
              onClick={() => onExecute?.(trimmedCommand)}
              disabled={!canExecute}
            >
              执行
            </Button>
            <Button
              size='small'
              danger
              icon={<CloseOutlined />}
              onClick={() => onReject?.()}
            >
              拒绝
            </Button>
          </div>
        </div>

        <div className='terminal-smart-shell-message'>
          {message}
        </div>

        <div className='terminal-smart-shell-meta'>
          <Tag color='purple'>{skill}</Tag>
          <Tag color={riskTag.color}>{riskTag.label}</Tag>
          <Tag color={statusTag.color}>{statusTag.label}</Tag>
          <Button
            size='small'
            type='text'
            icon={<CopyOutlined />}
            onClick={handleCopy}
          >
            复制
          </Button>
        </div>

        {proposal?.contextSummary && (
          <div className='terminal-smart-shell-context'>
            {proposal.contextSummary}
          </div>
        )}

        {commandBlock}

        {notes.length > 0 && (
          <div className='terminal-smart-shell-notes'>
            {notes.map((note, index) => (
              <div key={`${proposal.id}-note-${index}`}>
                • {note}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
