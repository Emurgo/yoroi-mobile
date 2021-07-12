// @flow

import React from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  TextInput as RNTextInput,
} from 'react-native'
import {HelperText, TextInput as RNPTextInput} from 'react-native-paper'
import styles from './styles/TextInput.style'
import openedEyeIcon from '../../assets/img/icon/visibility-opened.png'
import closedEyeIcon from '../../assets/img/icon/visibility-closed.png'
import CheckIcon from '../../assets/CheckIcon'
import {COLORS} from '../../styles/config'

import type {Props as TextInputProps} from 'react-native/Libraries/Components/TextInput/TextInput'
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet'

type Props = {|
  ...TextInputProps,
  containerStyle?: ViewStyleProp,
  label?: string,
  showCheckmark?: boolean,
  error?: boolean,
  helperText?: string,
  errorText?: string,
  disabled?: boolean,
  errorOnMount?: boolean,
  errorDelay?: number,
|}

const useDebounced = (callback, value, delay = 1000) => {
  const first = React.useRef(true)
  React.useEffect(
    () => {
      if (first.current) {
        first.current = false
        return () => {
          return
        }
      }

      const handler = setTimeout(() => callback(), delay)

      return () => clearTimeout(handler)
    },
    [callback, delay, value],
  )
}

const TextInput = React.forwardRef<Props, {focus: () => void}>(
  (
    {
      value,
      containerStyle,
      secureTextEntry,
      showCheckmark,
      helperText,
      errorText,
      errorOnMount,
      onBlur,
      errorDelay,
      ...restProps
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [errorTextEnabled, setErrorTextEnabled] = React.useState(errorOnMount)
    useDebounced(
      React.useCallback(() => setErrorTextEnabled(true), []),
      value,
      errorDelay,
    )

    return (
      <View style={containerStyle}>
        <RNPTextInput
          ref={ref}
          onBlur={(event) => {
            onBlur?.(event)
            setErrorTextEnabled(true)
          }}
          value={value}
          onChange={() => setErrorTextEnabled(false)}
          autoCorrect={false}
          autoCompleteType={'off'}
          theme={{
            roundness: 8,
            colors: {
              background: COLORS.BACKGROUND,
              placeholder: COLORS.TEXT_INPUT,
              primary: COLORS.BLACK,
              error: COLORS.ERROR_TEXT_COLOR,
            },
          }}
          secureTextEntry={secureTextEntry && !showPassword}
          mode={'outlined'}
          error={errorTextEnabled && !!errorText}
          render={(inputProps) => (
            <InputContainer>
              <RNTextInput {...inputProps} />

              {showCheckmark ? <Checkmark /> : null}

              {secureTextEntry ? (
                <SecureTextEntryToggle
                  showPassword={showPassword}
                  onPress={() => setShowPassword(!showPassword)}
                />
              ) : null}
            </InputContainer>
          )}
          {...restProps}
        />

        <HelperText
          type={errorTextEnabled && !!errorText ? 'error' : 'info'}
          visible
        >
          {errorTextEnabled && !!errorText ? errorText : helperText}
        </HelperText>
      </View>
    )
  },
)

const Checkmark = () => (
  <AdornmentContainer style={styles.checkmarkContainer}>
    <CheckIcon height={24} width={24} color={COLORS.LIGHT_POSITIVE_GREEN} />
  </AdornmentContainer>
)

const SecureTextEntryToggle = ({
  showPassword,
  onPress,
}: {
  showPassword: boolean,
  onPress: () => any,
}) => (
  <AdornmentContainer style={styles.secureTextEntryToggleContainer}>
    <TouchableOpacity onPress={onPress}>
      {showPassword ? (
        <Image source={closedEyeIcon} />
      ) : (
        <Image source={openedEyeIcon} />
      )}
    </TouchableOpacity>
  </AdornmentContainer>
)

const InputContainer = ({children}) => (
  <View style={styles.inputContainer}>{children}</View>
)

const AdornmentContainer = ({style, children}) => (
  <View style={[styles.adornmentContainer, style]}>{children}</View>
)

export default TextInput
