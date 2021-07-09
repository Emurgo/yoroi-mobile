// @flow
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {View, ScrollView} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {injectIntl, defineMessages, type IntlShape} from 'react-intl'

import {Button, TextInput} from '../UiKit'
import {
  validatePassword,
  getWalletNameError,
  validateWalletName,
  REQUIRED_PASSWORD_LENGTH,
} from '../../utils/validators'
import {CONFIG} from '../../config/config'
import styles from './styles/WalletForm.style'
import {walletNamesSelector} from '../../selectors'
import globalMessages from '../../i18n/global-messages'

import type {Navigation} from '../../types/navigation'

const WalletNameInput = TextInput
const PasswordInput = TextInput
const PasswordConfirmationInput = TextInput

const messages = defineMessages({
  walletNameInputLabel: {
    id: 'components.walletinit.walletform.walletNameInputLabel',
    defaultMessage: '!!!Wallet name',
  },
  newPasswordInput: {
    id: 'components.walletinit.walletform.newPasswordInput',
    defaultMessage: '!!!Spending password',
  },
  continueButton: {
    id: 'components.walletinit.walletform.continueButton',
    defaultMessage: '!!!Continue',
  },
  passwordStrengthRequirement: {
    id:
      'components.walletinit.createwallet.createwalletscreen.passwordLengthRequirement',
    defaultMessage: '!!!Minimum characters',
  },
  repeatPasswordInputLabel: {
    id: 'components.walletinit.walletform.repeatPasswordInputLabel',
    defaultMessage: '!!!Repeat password',
  },
  repeatPasswordInputError: {
    id: 'components.walletinit.walletform.repeatPasswordInputError',
    defaultMessage: '!!!Passwords do not match',
  },
})

type ComponentState = {
  name: string,
  password: string,
  passwordConfirmation: string,
  passwordConfirmationErrorEnabled: boolean,
  walletNameErrorEnabled: boolean,
  passwordErrorEnabled: boolean,
}

type Props = {
  intl: IntlShape,
  walletNames: Array<string>,
  onSubmit: ({name: string, password: string}) => mixed,
  navigation: Navigation,
}

class WalletForm extends PureComponent<Props, ComponentState> {
  passwordInputRef: {current: null | {focus: () => void}}
  repeatPasswordInputRef: {current: null | {focus: () => void}}

  passwordInputRef = React.createRef()
  repeatPasswordInputRef = React.createRef()

  /* prettier-ignore */
  state = CONFIG.DEBUG.PREFILL_FORMS
    ? {
      name: CONFIG.DEBUG.WALLET_NAME,
      password: CONFIG.DEBUG.PASSWORD,
      passwordConfirmation: CONFIG.DEBUG.PASSWORD,
      walletNameErrorEnabled: false,
      passwordErrorEnabled: false,
      passwordConfirmationErrorEnabled: false,
    }
    : {
      name: '',
      password: '',
      passwordConfirmation: '',
      walletNameErrorEnabled: false,
      passwordErrorEnabled: false,
      passwordConfirmationErrorEnabled: false,
    }

  _unsubscribe: void | (() => mixed) = undefined

  componentDidMount = () => {
    this._unsubscribe = this.props.navigation.addListener('blur', () =>
      this.setState({password: '', passwordConfirmation: ''}),
    )
  }

  componentWillUnmount = () => {
    if (this._unsubscribe != null) this._unsubscribe()
  }

  enablePasswordAndRepeatPasswordErrors = () => {
    this.state.password &&
      this.setState(() => ({
        passwordErrorEnabled: true,
        passwordConfirmationErrorEnabled: true,
      }))
  }

  enableRepeatPasswordErrors = () => {
    this.state.passwordConfirmation &&
      this.setState(() => ({passwordConfirmationErrorEnabled: true}))
  }

  handleSetPassword = (password) => {
    this.setState({password, passwordErrorEnabled: false})
  }

  handleSetPasswordConfirmation = (passwordConfirmation) => {
    this.setState({
      passwordConfirmation,
      passwordConfirmationErrorEnabled: false,
    })
  }

  render() {
    const {intl, walletNames} = this.props
    const {
      name,
      password,
      passwordConfirmation,
      walletNameErrorEnabled,
      passwordErrorEnabled,
      passwordConfirmationErrorEnabled,
    } = this.state

    const nameErrors = validateWalletName(name, null, walletNames)
    const passwordErrors = validatePassword(password, passwordConfirmation)

    const walletNameErrorText =
      getWalletNameError(
        {
          tooLong: intl.formatMessage(globalMessages.walletNameErrorTooLong),
          nameAlreadyTaken: intl.formatMessage(
            globalMessages.walletNameErrorNameAlreadyTaken,
          ),
          mustBeFilled: intl.formatMessage(
            globalMessages.walletNameErrorMustBeFilled,
          ),
        },
        nameErrors,
      ) || undefined

    const passwordErrorText = intl.formatMessage(
      messages.passwordStrengthRequirement,
      {
        requiredPasswordLength: REQUIRED_PASSWORD_LENGTH,
      },
    )

    const passwordConfirmationErrorText = intl.formatMessage(
      messages.repeatPasswordInputError,
    )

    return (
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={'always'}
        >
          <View style={styles.content}>
            <WalletNameInput
              autoFocus
              enablesReturnKeyAutomatically
              returnKeyType={'next'}
              label={intl.formatMessage(messages.walletNameInputLabel)}
              value={name}
              onChangeText={(name) =>
                this.setState({name, walletNameErrorEnabled: true})
              }
              errorText={
                walletNameErrorEnabled && Object.values(nameErrors).length > 0
                  ? walletNameErrorText
                  : undefined
              }
              onEndEditing={() => this.setState({walletNameErrorEnabled: true})}
              onSubmitEditing={() => this.passwordInputRef.current?.focus()}
              testID="walletNameInput"
            />

            <Spacer />

            <PasswordInput
              ref={this.passwordInputRef}
              onSubmitEditing={() =>
                this.repeatPasswordInputRef.current?.focus()
              }
              enablesReturnKeyAutomatically
              returnKeyType={'next'}
              secureTextEntry
              label={intl.formatMessage(messages.newPasswordInput)}
              value={password}
              onChangeText={this.handleSetPassword}
              debouncedOnChangeText={this.enablePasswordAndRepeatPasswordErrors}
              errorText={
                passwordErrorEnabled && passwordErrors.passwordIsWeak
                  ? passwordErrorText
                  : undefined
              }
              showCheckmark={!passwordErrors.passwordIsWeak}
              helperText={intl.formatMessage(
                messages.passwordStrengthRequirement,
                {
                  requiredPasswordLength: REQUIRED_PASSWORD_LENGTH,
                },
              )}
              onEndEditing={() => this.setState({passwordErrorEnabled: true})}
              testID="walletPasswordInput"
            />

            <Spacer />

            <PasswordConfirmationInput
              ref={this.repeatPasswordInputRef}
              enablesReturnKeyAutomatically
              returnKeyType={'done'}
              secureTextEntry
              label={intl.formatMessage(messages.repeatPasswordInputLabel)}
              value={passwordConfirmation}
              onChangeText={this.handleSetPasswordConfirmation}
              debouncedOnChangeText={this.enableRepeatPasswordErrors}
              errorText={
                !passwordErrors.passwordConfirmationReq &&
                passwordConfirmationErrorEnabled &&
                passwordErrors.matchesConfirmation
                  ? passwordConfirmationErrorText
                  : undefined
              }
              showCheckmark={
                !passwordErrors.passwordConfirmationReq &&
                !passwordErrors.matchesConfirmation
              }
              testID="walletRepeatPasswordInput"
            />
          </View>
        </ScrollView>

        <View style={styles.action}>
          <Button
            onPress={() => this.props.onSubmit({name, password})}
            disabled={
              Object.values(nameErrors).length > 0 ||
              Object.values(passwordErrors).length > 0
            }
            title={intl.formatMessage(messages.continueButton)}
            testID="walletFormContinueButton"
          />
        </View>
      </SafeAreaView>
    )
  }
}

export default injectIntl(
  connect((state) => ({walletNames: walletNamesSelector(state)}))(WalletForm),
)

const Spacer = () => <View style={styles.spacer} />
