// @flow

import React from 'react'
import {connect} from 'react-redux'
import {compose} from 'redux'
import {withHandlers} from 'recompose'
import {View} from 'react-native'

import Screen from '../Screen'
import Text from '../UiKit/Text'
import Button from '../UiKit/Button'
import {setSystemAuth, showErrorDialog} from '../../actions'
import {SETTINGS_ROUTES} from '../../RoutesList'
import {enrolledFingerprintsSelector} from '../../selectors'
import {withNavigationTitle} from '../../utils/renderUtils'

import styles from './styles/BiometricsLinkScreen.style'

import type {SubTranslation} from '../../l10n/typeHelpers'

const getTranslations = (state) => state.trans.BiometricsLinkScreen

type Props = {
  translations: SubTranslation<typeof getTranslations>,
  hasEnrolledFingerprints: boolean,
  linkBiometricsSignIn: () => mixed,
  cancelLinking: () => mixed,
}

const BiometricsLinkScreen = ({
  translations,
  hasEnrolledFingerprints,
  linkBiometricsSignIn,
  cancelLinking,
}: Props) => (
  <Screen scroll>
    <View style={styles.root}>
      {!hasEnrolledFingerprints ? (
        <Text>{translations.enableFingerprintsMessage}</Text>
      ) : null}

      <Button title={translations.notNowButton} onPress={cancelLinking} />
      <Button
        title={translations.linkButton}
        onPress={linkBiometricsSignIn}
        disabled={!hasEnrolledFingerprints}
      />
    </View>
  </Screen>
)

export default compose(
  connect(
    (state) => ({
      translations: getTranslations(state),
      hasEnrolledFingerprints: enrolledFingerprintsSelector(state),
    }),
    {setSystemAuth},
  ),
  withNavigationTitle(({translations}) => translations.title),
  withHandlers({
    linkBiometricsSignIn: ({navigation, setSystemAuth}) => () => {
      setSystemAuth(true)
        .then(() => navigation.navigate(SETTINGS_ROUTES.MAIN))
        .catch(() =>
          showErrorDialog((dialogs) => dialogs.disableEasyConfirmationFirst),
        )
    },
    cancelLinking: ({navigation}) => () =>
      navigation.navigate(SETTINGS_ROUTES.MAIN),
  }),
)(BiometricsLinkScreen)
