// @flow

import React from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  TextInput as RNTextInput,
  Platform,
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
  debouncedOnChangeText?: (text: ?string) => any,
|}

const useDebouncedCallback = ({
  callback,
  value,
  delay,
}: {
  callback: (value: any) => any,
  value: any,
  delay: number,
}) => {
  React.useEffect(
    () => {
      const handler = setTimeout(() => callback(value), delay)
      return () => clearTimeout(handler)
    },
    [callback, delay, value],
  )
}

const NOOP = () => null

const TextInput = React.forwardRef<Props, {focus: () => void}>(
  (
    {
      value,
      style,
      containerStyle,
      secureTextEntry,
      keyboardType,
      showCheckmark,
      helperText,
      errorText,
      autoFocus,
      debouncedOnChangeText = NOOP,
      debounceDelay = 1000,
      ...restProps
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)

    useDebouncedCallback({
      callback: debouncedOnChangeText,
      value,
      delay: debounceDelay,
    })

    return (
      <View style={containerStyle}>
        <RNPTextInput
          ref={ref}
          value={value}
          autoFocus={autoFocus}
          autoCorrect={false}
          autoCompleteType={'off'}
          keyboardType={
            Platform.OS === 'ios' && keyboardType === 'visible-password'
              ? 'default'
              : keyboardType
          }
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
          error={!!errorText}
          style={style}
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
          type={errorText ? 'error' : 'info'}
          visible={errorText || helperText}
        >
          {errorText || helperText}
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
