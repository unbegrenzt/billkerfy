import { Flex, Typography } from 'antd'
import {
  appBrandIconShellStyle,
  appBrandIconStyle,
  appBrandSubtitleStyle,
  appBrandWrapperStyle,
} from '@/components/atoms/AppBrand/AppBrand.styles'
import type { AppBrandProps } from '@/components/atoms/AppBrand/AppBrand.types'

export function AppBrand({ containerStyle, title = 'Billkerfy' }: AppBrandProps) {
  return (
    <Flex align="center" gap={10} style={{ ...appBrandWrapperStyle, ...containerStyle }}>
      <div style={appBrandIconShellStyle}>
        <img src="/billkerfy-mark.svg" alt="Billkerfy wallet mark" style={appBrandIconStyle} />
      </div>
      <div>
        <Typography.Title level={4} style={{ margin: 0, lineHeight: 1.1 }}>
          {title}
        </Typography.Title>
        <Typography.Text type="secondary" style={appBrandSubtitleStyle}>
          Wallet Workspace
        </Typography.Text>
      </div>
    </Flex>
  )
}
