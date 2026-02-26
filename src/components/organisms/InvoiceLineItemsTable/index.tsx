import { Button, Input, InputNumber, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { invoiceItemsFooterStyle } from '@/components/organisms/InvoiceLineItemsTable/InvoiceLineItemsTable.styles'
import type {
  InvoiceLineItem,
  InvoiceLineItemsTableProps,
} from '@/components/organisms/InvoiceLineItemsTable/InvoiceLineItemsTable.types'
import { formatCurrencyAmount, getCurrencySymbol } from '@/lib/currency'

export function InvoiceLineItemsTable({
  items,
  currencyCode,
  onItemChange,
  onAddItem,
  onRemoveItem,
}: InvoiceLineItemsTableProps) {
  const columns: ColumnsType<InvoiceLineItem> = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (_, item) => (
        <Input
          value={item.description}
          placeholder="Item or service description"
          onChange={(event) => onItemChange(item.id, 'description', event.target.value)}
        />
      ),
    },
    {
      title: 'Quantity',
      key: 'quantity',
      width: 130,
      render: (_, item) => (
        <InputNumber
          min={1}
          value={item.quantity}
          onChange={(value) => onItemChange(item.id, 'quantity', value ?? 1)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Unit Price',
      key: 'unitPrice',
      width: 170,
      render: (_, item) => (
        <InputNumber
          min={0}
          step={10}
          prefix={getCurrencySymbol(currencyCode)}
          value={item.unitPrice}
          onChange={(value) => onItemChange(item.id, 'unitPrice', value ?? 0)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Tax %',
      key: 'taxRate',
      width: 120,
      render: (_, item) => (
        <InputNumber
          min={0}
          max={100}
          value={item.taxRate}
          onChange={(value) => onItemChange(item.id, 'taxRate', value ?? 0)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Total',
      key: 'total',
      width: 180,
      align: 'right',
      render: (_, item) => {
        const lineSubtotal = item.quantity * item.unitPrice
        const lineTotal = lineSubtotal + lineSubtotal * (item.taxRate / 100)

        return <Typography.Text strong>{formatCurrencyAmount(lineTotal, currencyCode)}</Typography.Text>
      },
    },
    {
      title: '',
      key: 'actions',
      width: 90,
      align: 'center',
      render: (_, item) => (
        <Button type="text" danger onClick={() => onRemoveItem(item.id)}>
          Delete
        </Button>
      ),
    },
  ]

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      <Table<InvoiceLineItem>
        columns={columns}
        dataSource={items}
        rowKey="id"
        pagination={false}
        scroll={{ x: 980 }}
      />
      <div style={invoiceItemsFooterStyle}>
        <Button onClick={onAddItem}>Add Line Item</Button>
      </div>
    </Space>
  )
}
