// @flow

import React from 'react'
import {View, ScrollView, Platform} from 'react-native'
import {useSelector} from 'react-redux'
import {SafeAreaView} from 'react-native-safe-area-context'
import {injectIntl, defineMessages, type IntlShape} from 'react-intl'
import _ from 'lodash'

import {Text, TextInput, Button, StatusBar} from '../../UiKit'
import {WALLET_INIT_ROUTES} from '../../../RoutesList'
import {CONFIG, getWalletConfigById} from '../../../config/config'
import {
  validateRecoveryPhrase,
  INVALID_PHRASE_ERROR_CODES,
  cleanMnemonic,
} from '../../../utils/validators'
import {isKeyboardOpenSelector} from '../../../selectors'

import styles from './styles/RestoreWalletScreen.style'

import type {InvalidPhraseError} from '../../../utils/validators'
import type {Navigation} from '../../../types/navigation'
import type {WalletImplementationId} from '../../../config/types'

const mnemonicInputErrorsMessages = defineMessages({
  TOO_LONG: {
    id: 'components.walletinit.restorewallet.restorewalletscreen.toolong',
    defaultMessage: '!!!Phrase is too long. ',
    description: 'some desc',
  },
  TOO_SHORT: {
    id: 'components.walletinit.restorewallet.restorewalletscreen.tooshort',
    defaultMessage: '!!!Phrase is too short. ',
    description: 'some desc',
  },
  INVALID_CHECKSUM: {
    id:
      'components.walletinit.restorewallet.restorewalletscreen.invalidchecksum',
    defaultMessage: '!!!Please enter valid mnemonic.',
    description: 'some desc',
  },
  UNKNOWN_WORDS: {
    id: 'components.walletinit.restorewallet.restorewalletscreen.unknowwords',
    defaultMessage: '!!!{wordlist} {cnt, plural, one {is} other {are}} invalid',
    description: 'some desc',
  },
})

const messages = defineMessages({
  mnemonicInputLabel: {
    id:
      'components.walletinit.restorewallet.restorewalletscreen.mnemonicInputLabel',
    defaultMessage: '!!!Recovery phrase',
    description: 'some desc',
  },
  restoreButton: {
    id: 'components.walletinit.restorewallet.restorewalletscreen.restoreButton',
    defaultMessage: '!!!Restore wallet',
    description: 'some desc',
  },
  instructions: {
    id: 'components.walletinit.restorewallet.restorewalletscreen.instructions',
    defaultMessage:
      '!!!To restore your wallet please provide the {mnemonicLength}-word ' +
      'recovery phrase you received when you created your wallet for the ' +
      'first time.',
    description: 'some desc',
  },
})

const translateInvalidPhraseError = (
  intl: IntlShape,
  error: InvalidPhraseError,
) => {
  if (error.code === INVALID_PHRASE_ERROR_CODES.UNKNOWN_WORDS) {
    return intl.formatMessage(mnemonicInputErrorsMessages.UNKNOWN_WORDS, {
      cnt: error.words.length,
      wordlist: error.words.map((word) => `'${word}'`).join(', '),
    })
  } else {
    return intl.formatMessage(mnemonicInputErrorsMessages[error.code])
  }
}

const errorsVisibleWhileWriting = (errors) => {
  return errors
    .map((error) => {
      if (error.code !== INVALID_PHRASE_ERROR_CODES.UNKNOWN_WORDS) return error
      if (!error.lastMightBeUnfinished) return error
      if (error.words.length <= 1) return null
      return {
        code: error.code,
        words: _.initial(error.words),
        lastMightBeUnfinished: error.lastMightBeUnfinished,
      }
    })
    .filter((error) => !!error)
}

const RestoreWalletScreen = (
  {
    intl,
    route,
    navigation,
  }: {intl: IntlShape, navigation: Navigation} & Object /* TODO: type */,
) => {
  const implId: WalletImplementationId = route.params.walletImplementationId
  const [phrase, setPhrase] = React.useState(
    CONFIG.DEBUG.PREFILL_FORMS ? CONFIG.DEBUG.MNEMONIC3 : '',
  )

  const walletConfig = getWalletConfigById(implId)
  const errors = validateRecoveryPhrase(phrase, walletConfig.MNEMONIC_LEN)
  const hasErrors = Object.keys(errors).length > 0
  const visibleErrors = useSelector(isKeyboardOpenSelector)
    ? errorsVisibleWhileWriting(errors.invalidPhrase || [])
    : errors.invalidPhrase || []

  const errorText = visibleErrors
    .map((error) => translateInvalidPhraseError(intl, (error: any)))
    .join(' ')

  const navigateToWalletCredentials = () => {
    if (hasErrors) return

    navigation.navigate(WALLET_INIT_ROUTES.VERIFY_RESTORED_WALLET, {
      phrase: cleanMnemonic(phrase),
      networkId: route.params.networkId,
      walletImplementationId: route.params.walletImplementationId,
    })
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar type="dark" />

      <ScrollView
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.container}
      >
        <Text style={styles.instructions}>
          {intl.formatMessage(messages.instructions, {
            mnemonicLength: walletConfig.MNEMONIC_LEN,
          })}
        </Text>

        <Spacer />

        <TextInput
          autoFocus
          onChangeText={setPhrase}
          errorText={errorText}
          label={intl.formatMessage(messages.mnemonicInputLabel)}
          returnKeyLabel={'done'}
          multiline
          value={phrase}
          placeholder={intl.formatMessage(messages.mnemonicInputLabel)}
          blurOnSubmit
          autoCapitalize="none"
          keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
          // hopefully this prevents keyboard from learning the mnemonic
          autoCorrect={false}
        />
      </ScrollView>

      <Button
        onPress={navigateToWalletCredentials}
        title={intl.formatMessage(messages.restoreButton)}
        disabled={hasErrors}
      />
    </SafeAreaView>
  )
}

export default injectIntl(RestoreWalletScreen)

const Spacer = () => <View style={styles.spacer} />
