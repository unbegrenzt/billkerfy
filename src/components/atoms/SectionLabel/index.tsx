import { Typography } from 'antd'
import { sectionLabelStyle } from '@/components/atoms/SectionLabel/SectionLabel.styles'
import type { SectionLabelProps } from '@/components/atoms/SectionLabel/SectionLabel.types'

export function SectionLabel({ text }: SectionLabelProps) {
  return <Typography.Text style={sectionLabelStyle}>{text}</Typography.Text>
}
