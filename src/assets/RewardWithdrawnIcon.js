// @flow
/* eslint-disable max-len */

import React, {memo} from 'react'
import Svg, {G, Path} from 'react-native-svg'

type Props = {|
  width?: number,
  height?: number,
  color?: string,
|}

const RewardWithdrawnIcon = ({width = 36, height = 36, color = '#6B7384'}: Props) => (
  <Svg viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" {...{width, height}}>
    <G stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <G transform="translate(-760.000000, -425.000000)" fill={color}>
        <G transform="translate(760.000000, 425.000000)">
          <Path
            d="M25.0434285,21.5752295 L26.6637534,24.8117318 C26.7444747,24.9728114 26.7358128,25.1638977 26.641085,25.3170614 C26.5620223,25.4446364 26.432647,25.5306068 26.2872379,25.5558273 L26.1984076,25.5635591 L23.5445544,25.5635591 C23.3844017,25.5635591 23.2336481,25.6377477 23.1361558,25.7645864 L21.4830264,27.9171614 C21.3846127,28.04805 21.2301732,28.125 21.0668875,28.125 C20.893097,28.125 20.7382889,28.0397659 20.6435611,27.9075886 L20.6013574,27.8378182 L19.0608325,24.7618432 C18.9069459,24.4547795 19.0921627,24.0877023 19.430529,24.0265841 C19.4340306,24.0260318 19.4377165,24.0252955 19.4412181,24.0247432 C19.6658742,23.983875 19.8899773,24.0958023 19.9920769,24.2995909 L21.0987706,26.5079455 L21.2318318,26.5199114 L22.5747922,24.7323886 C22.6534863,24.627825 22.7679337,24.5576864 22.8943603,24.5337545 L22.9912997,24.52455 L25.2293826,24.52455 L25.2997834,24.4109659 L24.1143956,22.043925 C24.0176405,21.8506295 24.0517352,21.6173864 24.2011987,21.4612773 C24.2039632,21.4585159 24.2067276,21.4555705 24.209492,21.4528091 C24.4564478,21.1945295 24.8834602,21.2558318 25.0434285,21.5752295 Z M11.5078556,21.4568591 L11.515596,21.4649591 L11.515596,21.4649591 C11.6652439,21.6208841 11.6993385,21.8543114 11.6025835,22.0474227 L10.4190386,24.41115 L10.4892552,24.5247341 L12.7277066,24.5247341 C12.8587406,24.5247341 12.9835086,24.5740705 13.078605,24.6605932 L13.1438456,24.7323886 L14.4869902,26.5199114 L14.6200514,26.5079455 L15.7250864,24.3005114 C15.8271861,24.0965386 16.0511049,23.9846114 16.2755767,24.0252955 L16.2877402,24.0275045 L16.2877402,24.0275045 C16.6259222,24.0884386 16.8113233,24.4553318 16.657621,24.7623955 L15.1174646,27.8378182 C15.0313987,28.0092068 14.8546594,28.125 14.6519345,28.125 C14.5212691,28.125 14.3963169,28.0758477 14.3012205,27.9889568 L14.2356113,27.9171614 L12.6432994,25.7975386 C12.5472815,25.6697795 12.3972651,25.5939341 12.2372967,25.5920932 L9.52023016,25.5635591 C9.3399893,25.5635591 9.17246481,25.470225 9.077737,25.3170614 C8.99867429,25.1893023 8.97950757,25.0354023 9.0220798,24.8943886 L9.05488437,24.8117318 L10.6746563,21.5794636 C10.8344404,21.2604341 11.2608999,21.1991318 11.5078556,21.4568591 Z M17.859411,7.875 C22.0370183,7.875 25.4359777,11.2679795 25.4359777,15.4385591 C25.4359777,16.8656318 25.0369782,18.2350841 24.2981381,19.4208136 L24.1346681,19.6720977 C22.7657221,21.6742705 20.464426,22.9859182 17.8566466,22.9859182 C15.9792297,22.9859182 14.2606755,22.3060705 12.9343017,21.1794341 L12.9729868,21.213 L12.8908772,21.1436054 C12.863302,21.1196045 12.835888,21.0953966 12.8086123,21.0710045 L12.8089809,21.0704523 C12.6694693,20.9465591 12.5345651,20.8165909 12.4042683,20.6816523 C12.1027611,20.3736682 11.8288982,20.0399114 11.5845225,19.6844318 L11.5843382,19.6724659 C10.7408183,18.4305886 10.2830287,16.9676182 10.2830287,15.4385591 C10.2830287,11.2679795 13.6818037,7.875 17.859411,7.875 Z M17.859411,8.91364091 C14.2555152,8.91364091 11.3235603,11.8406864 11.3235603,15.4385591 C11.3235603,19.0362477 14.2555152,21.9632932 17.859411,21.9632932 C21.4633068,21.9632932 24.3952617,19.0362477 24.3952617,15.4385591 C24.3952617,11.8406864 21.4633068,8.91364091 17.859411,8.91364091 Z M18.6806178,17.0325581 L18.7043478,17.0369061 C18.7266736,17.0453216 18.744085,17.0652383 18.7470337,17.0902043 L18.7449275,17.1164326 L17.9039866,20.1599011 L17.8893835,20.1871112 C17.8635473,20.2161447 17.8155257,20.2161447 17.7896894,20.1871112 L17.7750864,20.1599011 L16.9341455,17.1164326 L16.9323201,17.0883809 C16.9375154,17.0530358 16.9717765,17.0282101 17.0074417,17.0331191 L17.0341204,17.0427969 L17.1371845,17.1003029 C17.3059624,17.1862814 17.4922921,17.2423847 17.6895741,17.2613196 L17.8395365,17.2684728 L17.964786,17.2634235 C18.2126171,17.2436471 18.4435985,17.1652426 18.6448121,17.0427969 C18.6566069,17.0356438 18.668823,17.0325581 18.6806178,17.0325581 Z M17.8395365,14.3998304 L17.9284187,14.4041784 C18.3646857,14.4475183 18.7123514,14.8061591 18.7567223,15.2579317 L18.7614964,15.3561126 L18.7572839,15.4481221 C18.7157213,15.9007362 18.3698811,16.2613407 17.9341757,16.3073455 L17.8395365,16.3122545 L17.7506543,16.3079065 C17.2832153,16.2616212 16.9175766,15.8531886 16.9175766,15.3561126 C16.9175766,14.8278992 17.3303945,14.3998304 17.8395365,14.3998304 Z M16.1258936,14.5177877 L16.1515894,14.5236786 C16.175179,14.5348993 16.1907649,14.5607068 16.1889396,14.5886183 L16.1807955,14.61667 L16.1275785,14.7291572 C16.0620051,14.8824598 16.0197404,15.0489465 16.0054182,15.2235683 L16.0000824,15.3561126 L16.0051373,15.4855712 C16.0187575,15.656406 16.0590564,15.8193863 16.1216811,15.9700239 L16.1727919,16.0805476 L16.1803743,16.1067759 C16.183323,16.14156 16.1590313,16.1735389 16.1257532,16.1781675 L16.0994957,16.1763441 L13.4347143,15.4138991 L13.4084568,15.3993122 C13.3805144,15.3735046 13.3805144,15.3255362 13.4084568,15.2997287 L13.4347143,15.2851418 L16.108061,14.5203124 C16.1140988,14.5186293 16.1201366,14.5177877 16.1258936,14.5177877 Z M19.5256091,14.5177877 L19.5344552,14.518489 L19.5434417,14.5203124 L22.2166479,15.2851418 L22.2429054,15.2997287 C22.2709882,15.3255362 22.2709882,15.3735046 22.2429054,15.3993122 L22.2166479,15.4138991 L19.5518665,16.1763441 L19.5256091,16.1781675 C19.4924713,16.1735389 19.4681796,16.14156 19.4711283,16.1067759 L19.4788511,16.0805476 L19.5298215,15.9700239 C19.5924462,15.8193863 19.6327451,15.656406 19.6463653,15.4855712 L19.6514202,15.3561126 L19.6460845,15.2235683 C19.6282519,15.0051859 19.56661,14.7998475 19.4707071,14.61667 C19.4464154,14.5703847 19.4794128,14.5177877 19.5256091,14.5177877 Z M17.8395365,10.575 C17.8580712,10.575 17.8764654,10.5822934 17.8893835,10.5968803 L17.9039866,10.6240905 L18.7968808,13.855365 L18.7916854,13.855365 L18.6898851,13.7827111 C18.4803871,13.6453981 18.2360663,13.5567547 17.9726492,13.5343134 L17.8395365,13.5285628 L17.7062834,13.5343134 C17.4428663,13.5567547 17.1985455,13.6453981 16.9891879,13.7827111 L16.8873875,13.855365 L16.8821922,13.855365 L17.7750864,10.6240905 L17.7896894,10.5968803 C17.8026075,10.5822934 17.8210018,10.575 17.8395365,10.575 Z"
            stroke={color}
            stroke-width="0.4"
          />
        </G>
      </G>
    </G>
  </Svg>
)

export default memo<Props>(RewardWithdrawnIcon)
