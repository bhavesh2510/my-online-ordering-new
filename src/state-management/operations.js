import { saveState, getState, clearState as localStorageClearState } from './utils/localStorage';

function _getStorageKey(viewType, restId) {
  return restId ? [viewType, restId].join('-') : viewType;
}

export function getPersistedState(viewType, restaurantId, reducerKey) {
  const storageKey = _getStorageKey(viewType, restaurantId);

  return getState(storageKey)[reducerKey];
}

export function persistState(state, attributes, reducerKey) {
  const { viewType, restaurantId } = state;
  const storageKey = _getStorageKey(viewType, restaurantId);

  if (!storageKey) {
    return;
  }

  const stateToPersist = {};

  for (const attr in state) {
    if (attributes.indexOf(attr) >= 0) {
      stateToPersist[attr] = state[attr];
    }
  }

  saveState(storageKey, { [reducerKey]: stateToPersist });
}

export function clearState(viewType, restaurantId) {
  const storageKey = _getStorageKey(viewType, restaurantId);

  localStorageClearState(storageKey);
}