// @flow

import React from 'react'
import {StyleSheet, View, Platform} from 'react-native'

import {storiesOf} from '@storybook/react-native'
import {action} from '@storybook/addon-actions'

import TextInput from './TextInput'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
})

storiesOf('TextInput', module)
  .addDecorator((story) => <View style={styles.container}>{story()}</View>)
  .add('with label', () => (
    <TextInput label={'This is a label'} onChangeText={action()} />
  ))
  .add('secure entry', () => (
    <TextInput
      secureTextEntry
      label={'secure entry'}
      keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
      onChangeText={action()}
    />
  ))
  .add('secure entry, with checkmark', () => (
    <TextInput
      label={'secure entry, with checkmark'}
      showCheckmark
      secureTextEntry
      keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
      onChangeText={action()}
    />
  ))
  .add('with error', () => (
    <TextInput
      label={'with error'}
      onChangeText={action()}
      errorText={'This is what an error text look like'}
    />
  ))
  .add('numeric entry', () => (
    <TextInput
      label={'numeric input'}
      keyboardType={'numeric'}
      onChangeText={action()}
    />
  ))
  .add('prefilled', () => (
    <TextInput
      label={'prefilled'}
      value={'prefilled value'}
      onChangeText={action()}
    />
  ))
  .add('disabled', () => (
    <TextInput
      label={'disabled'}
      value={'prefilled value'}
      disabled
      onChangeText={action()}
    />
  ))
  .add('with helper text', () => (
    <TextInput
      label={'with helper text'}
      onChangeText={action()}
      helperText={'This is what helper text looks like'}
    />
  ))
  .add('with helper text and error text', () => (
    <TextInput
      label={'with helper text and error text'}
      onChangeText={action()}
      helperText={'This is what helper text looks like'}
      errorText={'This is what an error looks likes'}
    />
  ))
