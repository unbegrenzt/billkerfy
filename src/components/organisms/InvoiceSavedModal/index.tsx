import { Button, Modal, Space, Typography } from 'antd'
import {
  invoiceSavedModalFooterLinksStyle,
  invoiceSavedModalIconWrapStyle,
} from '@/components/organisms/InvoiceSavedModal/InvoiceSavedModal.styles'
import type { InvoiceSavedModalProps } from '@/components/organisms/InvoiceSavedModal/InvoiceSavedModal.types'
import { formatCurrencyAmount } from '@/lib/currency'

export function InvoiceSavedModal({
  open,
  data,
  onClose,
  onDownloadPdf,
  onSendEmail,
  onCreateAnother,
  onBackToList,
}: InvoiceSavedModalProps) {
  return (
    <Modal open={open} onCancel={onClose} footer={null} width={460} centered>
      <div style={{ textAlign: 'center' }}>
        <div style={invoiceSavedModalIconWrapStyle}>
          <i className="mgc_check_circle_fill" style={{ fontSize: 52 }} />
        </div>
        <Typography.Title level={3} style={{ marginBottom: 6 }}>
          ¡Factura emitida correctamente!
        </Typography.Title>
        <Typography.Text type="secondary">
          La factura <Typography.Text strong>{data?.invoiceNumber ?? '-'}</Typography.Text> ha sido
          generada con éxito y está lista para ser guardada.
        </Typography.Text>
      </div>
      <Space direction="vertical" size={12} style={{ width: '100%', marginTop: 24 }}>
        <Button
          type="primary"
          size="large"
          block
          icon={<i className="mgc_file_download_line" />}
          onClick={onDownloadPdf}
          style={{ height: 52, fontWeight: 700, borderRadius: 14 }}
        >
          Descargar como PDF
        </Button>
        <Button
          size="large"
          block
          icon={<i className="mgc_mail_line" />}
          onClick={onSendEmail}
          style={{ height: 52, fontWeight: 700, borderRadius: 14 }}
        >
          Enviar por Email
        </Button>
      </Space>
      <div style={invoiceSavedModalFooterLinksStyle}>
        <Button type="link" icon={<i className="mgc_add_circle_line" />} onClick={onCreateAnother}>
          Crear otra factura
        </Button>
        <Button type="link" icon={<i className="mgc_list_check_line" />} onClick={onBackToList}>
          Volver al listado
        </Button>
      </div>
      <div
        style={{
          marginTop: 14,
          fontSize: 12,
          color: '#64748b',
          textAlign: 'center',
          background: '#f8fafc',
          padding: 10,
          borderRadius: 10,
        }}
      >
        {data
          ? `${data.invoiceNumber} • ${data.customerName} • ${formatCurrencyAmount(
              data.totalAmount,
              data.currencyCode,
            )}`
          : ''}
      </div>
    </Modal>
  )
}
