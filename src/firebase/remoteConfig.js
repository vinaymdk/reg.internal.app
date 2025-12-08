import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config'
import { app } from './firebase.js'

const remoteConfig = getRemoteConfig(app)
remoteConfig.settings = {
  minimumFetchIntervalMillis: 60 * 60 * 1000, // 1h
}

export { remoteConfig }

export const refreshRemoteConfig = () => fetchAndActivate(remoteConfig)

export const getRemoteValue = (key) => getValue(remoteConfig, key)

