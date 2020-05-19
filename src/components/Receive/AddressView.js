// @flow

import React from 'react'
import {connect} from 'react-redux'
import {compose} from 'redux'
import {withStateHandlers, withHandlers} from 'recompose'
import {View, TouchableOpacity, Image} from 'react-native'
import {withNavigation} from 'react-navigation'
import {injectIntl, intlShape} from 'react-intl'

import {
  isUsedAddressIndexSelector,
  externalAddressIndexSelector,
  isHWSelector,
  hwDeviceInfoSelector,
} from '../../selectors'
import {showErrorDialog, handleGeneralError} from '../../actions'

import {Text} from '../UiKit'
import AddressModal from './AddressModal'
import LedgerTransportSwitchModal from '../Ledger/LedgerTransportSwitchModal'
import AddressVerifyModal from './AddressVerifyModal'
import {
  verifyAddress,
  GeneralConnectionError,
  LedgerUserError,
} from '../../crypto/byron/ledgerUtils'
import walletManager from '../../crypto/wallet'
import {errorMessages} from '../../i18n/global-messages'

import styles from './styles/AddressView.style'
import copyIcon from '../../assets/img/icon/copy.png'

import type {ComponentType} from 'react'
import type {HWDeviceInfo} from '../../crypto/byron/ledgerUtils'

const _handleOnVerifyAddress = async (
  intl: intlShape,
  address: string,
  index: number,
  hwDeviceInfo: HWDeviceInfo,
  useUSB: boolean,
  closeDetails: () => void,
) => {
  try {
    const addressing = walletManager.getAddressingInfo(address)
    if (addressing == null) return
    await verifyAddress(address, {addressing}, hwDeviceInfo, useUSB)
  } catch (e) {
    if (e instanceof GeneralConnectionError || e instanceof LedgerUserError) {
      await showErrorDialog(errorMessages.hwConnectionError, intl)
    } else {
      handleGeneralError('Could not submit transaction', e, intl)
    }
  } finally {
    closeDetails()
  }
}

const ADDRESS_DIALOG_STEPS = {
  CLOSED: 'CLOSED',
  ADDRESS_DETAILS: 'ADDRESS_DETAILS',
  CHOOSE_TRANSPORT: 'CHOOSE_TRANSPORT',
  ADDRESS_VERIFY: 'ADDRESS_VERIFY',
}
type AddressDialogSteps = $Values<typeof ADDRESS_DIALOG_STEPS>

type Props = {|
  index: number,
  address: string,
  isUsed: boolean,
  openDetails: () => void,
  closeDetails: () => void,
  onVerifyAddress: () => void,
  addressDialogStep: AddressDialogSteps,
  openTransportSwitch: () => void,
  openAddressVerify: (Object, boolean) => void,
  useUSB: boolean,
|}

const AddressView = ({
  address,
  index,
  isUsed,
  isHW,
  openDetails,
  closeDetails,
  onVerifyAddress,
  addressDialogStep,
  openTransportSwitch,
  openAddressVerify,
  useUSB,
}: Props) => (
  <>
    <TouchableOpacity activeOpacity={0.5} onPress={openDetails}>
      <View style={styles.container}>
        <View style={styles.addressContainer}>
          <Text secondary={isUsed} small bold>{`/${index}`}</Text>
          <Text
            secondary={isUsed}
            small
            numberOfLines={1}
            ellipsizeMode="middle"
            monospace
            style={styles.text}
          >
            {address}
          </Text>
        </View>
        <Image source={copyIcon} width={24} />
      </View>
    </TouchableOpacity>
    <AddressModal
      visible={addressDialogStep === ADDRESS_DIALOG_STEPS.ADDRESS_DETAILS}
      address={address}
      onRequestClose={closeDetails}
      onAddressVerify={openTransportSwitch}
    />

    <LedgerTransportSwitchModal
      visible={addressDialogStep === ADDRESS_DIALOG_STEPS.CHOOSE_TRANSPORT}
      onRequestClose={closeDetails}
      onSelectUSB={(event) => openAddressVerify(event, true)}
      onSelectBLE={(event) => openAddressVerify(event, false)}
      showCloseIcon
    />

    <AddressVerifyModal
      visible={addressDialogStep === ADDRESS_DIALOG_STEPS.ADDRESS_VERIFY}
      onRequestClose={closeDetails}
      showCloseIcon
      onConfirm={onVerifyAddress}
    />
  </>
)

type ExternalProps = {|
  address: string,
|}

export default injectIntl(
  (compose(
    // TODO(ppershing): this makes Flow bail out from checking types
    withNavigation,
    connect((state, {address}) => ({
      index: externalAddressIndexSelector(state)[address],
      isUsed: !!isUsedAddressIndexSelector(state)[address],
      isHW: isHWSelector(state),
      hwDeviceInfo: hwDeviceInfoSelector(state),
    })),
    withStateHandlers(
      {
        addressDialogStep: ADDRESS_DIALOG_STEPS.CLOSED,
        useUSB: false,
      },
      {
        openDetails: (state) => () => ({
          addressDialogStep: ADDRESS_DIALOG_STEPS.ADDRESS_DETAILS,
        }),
        closeDetails: (state) => () => ({
          addressDialogStep: ADDRESS_DIALOG_STEPS.CLOSED,
        }),
        openTransportSwitch: (state) => () => ({
          addressDialogStep: ADDRESS_DIALOG_STEPS.CHOOSE_TRANSPORT,
        }),
        openAddressVerify: (state) => (useUSB) => ({
          addressDialogStep: ADDRESS_DIALOG_STEPS.ADDRESS_VERIFY,
          useUSB,
        }),
      },
    ),
    withHandlers({
      onVerifyAddress: ({
        intl,
        address,
        index,
        hwDeviceInfo,
        useUSB,
        closeDetails,
      }) => async (event) => {
        await _handleOnVerifyAddress(
          intl,
          address,
          index,
          hwDeviceInfo,
          useUSB,
          closeDetails,
        )
      },
    }),
  )(AddressView): ComponentType<ExternalProps>),
)
