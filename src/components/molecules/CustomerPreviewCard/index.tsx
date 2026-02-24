import { Button, Card, Flex, Typography } from 'antd'
import { customerAvatarStyle } from '@/components/molecules/CustomerPreviewCard/CustomerPreviewCard.styles'
import type { CustomerPreviewCardProps } from '@/components/molecules/CustomerPreviewCard/CustomerPreviewCard.types'

export function CustomerPreviewCard({ companyName, taxId, address, onClear }: CustomerPreviewCardProps) {
  return (
    <Card size="small">
      <Flex align="start" gap={12} justify="space-between">
        <Flex align="start" gap={12}>
          <div style={customerAvatarStyle}>TS</div>
          <Flex vertical>
            <Typography.Text strong>{companyName}</Typography.Text>
            <Typography.Text type="secondary">Tax ID: {taxId}</Typography.Text>
            <Typography.Text type="secondary">{address}</Typography.Text>
          </Flex>
        </Flex>
        <Button type="text" onClick={onClear}>
          Remove
        </Button>
      </Flex>
    </Card>
  )
}
