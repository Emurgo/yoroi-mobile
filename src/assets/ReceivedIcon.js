// @flow
/* eslint-disable max-len */

import React, {memo} from 'react'
import Svg, {G, Path, Rect} from 'react-native-svg'

type Props = {|
  width?: number,
  height?: number,
  color?: string,
|}

const ReceivedIcon = ({width = 36, height = 36, color = '#6B7384'}: Props) => (
  <Svg viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" {...{width, height}}>
    <G stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <G transform="translate(-760.000000, -126.000000)">
        <G transform="translate(760.000000, 126.000000)">
          <G transform="translate(6.000000, 6.000000)">
            <Rect x="0" y="0" width="24" height="24" />
            <Path
              d="M13.3235083,5.35944574 C13.0375946,5.72375698 13.0635868,6.25046728 13.4014848,6.58525141 L17.7999327,10.9431655 L3.94095839,10.7381235 C3.4201572,10.7380961 3.00000024,11.1534078 3.00000024,11.6667187 L3.00632611,11.7752319 C3.06064196,12.2378639 3.45809729,12.5953341 3.94094008,12.5953685 L17.799,12.8 L13.4016317,17.1583276 C13.0355863,17.5209998 13.0355708,18.1089293 13.4015984,18.4715837 C13.5785616,18.6468443 13.8157782,18.7435947 14.0643899,18.7435947 C14.3129567,18.7435947 14.5501162,18.6468735 14.7270701,18.471694 L20.7254603,12.5284334 C21.0915143,12.1657528 21.0915143,11.5778233 20.7254581,11.2151405 L14.7269951,5.27195629 C14.3610139,4.90934777 13.767466,4.90934777 13.4014848,5.27195629 L13.3235083,5.35944574 Z"
              fill={color}
              fill-rule="nonzero"
              transform="translate(12.000000, 11.871797) rotate(-225.000000) translate(-12.000000, -11.871797) "
            />
          </G>
        </G>
      </G>
    </G>
  </Svg>
)

export default memo<Props>(ReceivedIcon)
