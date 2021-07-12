// @flow

import React, {PureComponent} from 'react'
import {View, ScrollView} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {injectIntl, defineMessages, type IntlShape} from 'react-intl'

import {Button, StatusBar, TextInput} from '../UiKit'
import {
  validatePassword,
  REQUIRED_PASSWORD_LENGTH,
} from '../../utils/validators'
import {errorMessages} from '../../i18n/global-messages'
import {showErrorDialog} from '../../actions'
import walletManager from '../../crypto/walletManager'
import {WrongPassword} from '../../crypto/errors'

import styles from './styles/ChangePasswordScreen.style'

import type {PasswordValidationErrors} from '../../utils/validators'
import type {Navigation} from '../../types/navigation'

const CurrentPasswordInput = TextInput
const NewPasswordInput = TextInput
const PasswordConfirmationInput = TextInput

const messages = defineMessages({
  oldPasswordInputLabel: {
    id: 'components.settings.changepasswordscreen.oldPasswordInputLabel',
    defaultMessage: 'Current password',
    description: 'some desc',
  },
  newPasswordInputLabel: {
    id: 'components.settings.changepasswordscreen.newPasswordInputLabel',
    defaultMessage: 'New password',
    description: 'some desc',
  },
  passwordStrengthRequirement: {
    id:
      'components.walletinit.createwallet.createwalletscreen.passwordLengthRequirement',
    defaultMessage: '!!!Minimum characters',
  },
  repeatPasswordInputLabel: {
    id: 'components.settings.changepasswordscreen.repeatPasswordInputLabel',
    defaultMessage: 'Repeat new password',
    description: 'some desc',
  },
  repeatPasswordInputError: {
    id: 'components.walletinit.walletform.repeatPasswordInputError',
    defaultMessage: '!!!Passwords do not match',
  },
  continueButton: {
    id: 'components.settings.changepasswordscreen.continueButton',
    defaultMessage: 'Change password',
    description: 'some desc',
  },
})

type FormValidationErrors = {
  ...PasswordValidationErrors,
  oldPasswordRequired?: boolean,
}

const validateForm = ({
  oldPassword,
  password,
  passwordConfirmation,
}): FormValidationErrors => {
  const passwordErrors = validatePassword(password, passwordConfirmation)

  const oldPasswordErrors =
    oldPassword.length === 0 ? {oldPasswordRequired: true} : {}

  return {...oldPasswordErrors, ...passwordErrors}
}

type ComponentState = {
  oldPassword: string,
  password: string,
  passwordConfirmation: string,
}

type Props = {
  onSubmit: (string, string) => any,
  navigation: Navigation,
  intl: IntlShape,
}

class ChangePasswordScreen extends PureComponent<Props, ComponentState> {
  passwordInputRef: {current: null | {focus: () => void}}
  passwordInputRef = React.createRef()

  newPasswordInputRef = React.createRef()
  newPasswordInputRef: {current: null | {focus: () => void}}

  passwordConfirmationInputRef: {current: null | {focus: () => void}}
  passwordConfirmationInputRef = React.createRef()

  state = {
    oldPassword: '',
    password: '',
    passwordConfirmation: '',
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

  handleSetOldPassword = (oldPassword) => {
    this.setState({oldPassword})
  }

  handleSetPassword = (password) => {
    this.setState({password})
  }

  handleSetPasswordConfirmation = (passwordConfirmation) => {
    this.setState({passwordConfirmation})
  }

  handleSubmit = async () => {
    const {oldPassword, password} = this.state
    const {intl, navigation} = this.props
    try {
      await walletManager.changePassword(oldPassword, password, intl)
      navigation.goBack(null)
    } catch (error) {
      if (error instanceof WrongPassword) {
        await showErrorDialog(errorMessages.incorrectPassword, intl)
      } else {
        throw error
      }
    }
  }

  render() {
    const {intl} = this.props
    const {oldPassword, password, passwordConfirmation} = this.state

    const errors = validateForm({
      oldPassword,
      password,
      passwordConfirmation,
    })
    const hasErrors = Object.keys(errors).length > 0

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
      <SafeAreaView
        style={styles.safeAreaView}
        edges={['left', 'right', 'bottom']}
      >
        <StatusBar type="dark" />

        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.scrollContentContainer}
        >
          <CurrentPasswordInput
            ref={this.passwordInputRef}
            returnKeyType={'next'}
            enablesReturnKeyAutomatically
            autoFocus
            secureTextEntry
            errorText={
              errors.oldPasswordRequired ? passwordErrorText : undefined
            }
            label={intl.formatMessage(messages.oldPasswordInputLabel)}
            value={oldPassword}
            onChangeText={this.handleSetOldPassword}
            onSubmitEditing={() => this.newPasswordInputRef.current?.focus()}
          />

          <Spacer />

          <NewPasswordInput
            returnKeyType={'next'}
            ref={this.newPasswordInputRef}
            enablesReturnKeyAutomatically
            secureTextEntry
            label={intl.formatMessage(messages.newPasswordInputLabel)}
            value={password}
            onChangeText={this.handleSetPassword}
            helperText={intl.formatMessage(
              messages.passwordStrengthRequirement,
              {
                requiredPasswordLength: REQUIRED_PASSWORD_LENGTH,
              },
            )}
            errorText={errors.passwordIsWeak ? passwordErrorText : undefined}
            showCheckmark={!errors.passwordIsWeak}
            onSubmitEditing={() =>
              this.passwordConfirmationInputRef.current?.focus()
            }
          />

          <Spacer />

          <PasswordConfirmationInput
            returnKeyType={'done'}
            ref={this.passwordConfirmationInputRef}
            enablesReturnKeyAutomatically
            secureTextEntry
            label={intl.formatMessage(messages.repeatPasswordInputLabel)}
            value={passwordConfirmation}
            onChangeText={this.handleSetPasswordConfirmation}
            errorText={
              errors.matchesConfirmation
                ? passwordConfirmationErrorText
                : undefined
            }
            showCheckmark={
              !errors.passwordConfirmationReq && !errors.matchesConfirmation
            }
          />
        </ScrollView>

        <View style={styles.action}>
          <Button
            onPress={this.handleSubmit}
            disabled={hasErrors}
            title={intl.formatMessage(messages.continueButton)}
          />
        </View>
      </SafeAreaView>
    )
  }
}

export default injectIntl(ChangePasswordScreen)

const Spacer = () => <View style={styles.spacer} />
