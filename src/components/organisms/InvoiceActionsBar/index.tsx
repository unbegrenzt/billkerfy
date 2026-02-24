import { Button, Flex, Typography } from 'antd'
import { invoiceActionsBarStyle } from '@/components/organisms/InvoiceActionsBar/InvoiceActionsBar.styles'
import type { InvoiceActionsBarProps } from '@/components/organisms/InvoiceActionsBar/InvoiceActionsBar.types'

export function InvoiceActionsBar({
  onCancel,
  onSaveDraft,
  onIssueInvoice,
  onIssueAndMarkPaid,
}: InvoiceActionsBarProps) {
  return (
    <div style={invoiceActionsBarStyle}>
      <Flex align="center" justify="space-between" gap={12} wrap>
        <Typography.Text type="secondary">Draft is saved automatically.</Typography.Text>
        <Flex gap={8} wrap>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onSaveDraft}>Save Draft</Button>
          <Button type="primary" onClick={onIssueInvoice}>
            Issue Invoice
          </Button>
          <Button color="cyan" variant="solid" onClick={onIssueAndMarkPaid}>
            Issue and Mark Paid
          </Button>
        </Flex>
      </Flex>
    </div>
  )
}
