import { Button, Card, Flex, Input, Typography } from 'antd'
import { customerAvatarStyle } from '@/components/molecules/CustomerPreviewCard/CustomerPreviewCard.styles'
import type { CustomerPreviewCardProps } from '@/components/molecules/CustomerPreviewCard/CustomerPreviewCard.types'

export function CustomerPreviewCard({
  companyName,
  taxId,
  address,
  isEditing,
  isSaving,
  onStartEdit,
  onTaxIdChange,
  onAddressChange,
  onSave,
  onClear,
}: CustomerPreviewCardProps) {
  return (
    <Card size="small">
      <Flex align="start" gap={12} justify="space-between">
        <Flex align="start" gap={12}>
          <div style={customerAvatarStyle}>TS</div>
          <Flex vertical gap={8} style={{ minWidth: 320 }}>
            <Typography.Text strong>{companyName}</Typography.Text>
            <Typography.Text type="secondary">Tax ID</Typography.Text>
            {isEditing ? (
              <Input
                value={taxId}
                placeholder="Tax ID"
                onChange={(event) => onTaxIdChange(event.target.value)}
              />
            ) : (
              <Typography.Text>{taxId}</Typography.Text>
            )}
            <Typography.Text type="secondary">Address</Typography.Text>
            {isEditing ? (
              <Input
                value={address}
                placeholder="Address"
                onChange={(event) => onAddressChange(event.target.value)}
              />
            ) : (
              <Typography.Text>{address}</Typography.Text>
            )}
          </Flex>
        </Flex>
        <Flex vertical gap={8}>
          {isEditing ? (
            <>
              <Button type="primary" loading={isSaving} onClick={onSave} icon={<i className="mgc_check_line" />}>
                Save
              </Button>
              <Button danger onClick={onClear} icon={<i className="mgc_delete_2_line" />}>
                Remove
              </Button>
            </>
          ) : (
            <Button type="text" onClick={onStartEdit} icon={<i className="mgc_edit_3_line" />}>
              Edit
            </Button>
          )}
        </Flex>
      </Flex>
    </Card>
  )
}
