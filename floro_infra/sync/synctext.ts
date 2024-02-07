import {getJSON} from '@floro/text-generator';
import metaFloro from '../floro_modules/meta.floro';
import {
  LocalizedPhraseKeys,
  LocalizedPhrases,
  PhraseKeyDebugInfo,
  PhraseKeys,
} from '../floro_modules/text-generator';
import staticStructure from '../floro_modules/text-generator/static-structure.json';
import initText from '../floro_modules/text-generator/text.json';
//@ts-ignore
import {API_HOST, API_KEY} from '@env';
import AsyncStorage from '../../src/helpers/AsyncStorageProxy';
/**
 * This does not need to be AsyncStorage, you could use SQLite, fs, or any
 * other local persistence kv store.
 *
 */

const FLORO_TEXT_PREFIX = 'floro_text:';
const FLORO_TEXT_BUILD_PREFIX = FLORO_TEXT_PREFIX + metaFloro.sha;
const FLORO_TEXT_LAST_SHA_PREFIX = 'floro_text_last_sha:';
const FLORO_TEXT_LAST_SHA_BUILD_PREFIX =
  FLORO_TEXT_LAST_SHA_PREFIX + metaFloro.sha;

const argsAreSame = (
  existingArgs: {[key: string]: string | number | boolean},
  incomingArgs: {[key: string]: string | number | boolean},
): boolean => {
  if (Object.keys(existingArgs).length != Object.keys(incomingArgs).length) {
    return false;
  }
  for (const key in existingArgs) {
    if (incomingArgs?.[key] != existingArgs[key]) {
      return false;
    }
  }
  return true;
};

const getUpdatedText = (localesJSON: LocalizedPhrases): LocalizedPhrases => {
  for (const localeCode in localesJSON.locales) {
    const localesJSONPhraseKeys =
      localesJSON.localizedPhraseKeys?.[
        localeCode as string & keyof LocalizedPhraseKeys
      ] ?? ({} as LocalizedPhrases);
    const initJSONPhraseKeys =
      initText.localizedPhraseKeys?.[
        localeCode as string & keyof LocalizedPhraseKeys
      ] ?? ({} as LocalizedPhrases);
    for (let phraseKey in staticStructure.structure) {
      if (
        !localesJSONPhraseKeys?.[
          phraseKey as keyof typeof localesJSONPhraseKeys
        ]
      ) {
        (localesJSONPhraseKeys[
          phraseKey as keyof PhraseKeys
        ] as PhraseKeys[keyof PhraseKeys]) = initJSONPhraseKeys[
          phraseKey as keyof PhraseKeys
        ] as PhraseKeys[keyof PhraseKeys];
      } else {
        if (
          !argsAreSame(
            (
              staticStructure?.structure as {
                [key: string]: {[key: string]: string | number | boolean};
              }
            )?.[phraseKey as string] as {
              [key: string]: string | number | boolean;
            },
            localesJSONPhraseKeys[phraseKey as keyof PhraseKeys].args as {
              [key: string]: string | number | boolean;
            },
          )
        ) {
          (localesJSONPhraseKeys[
            phraseKey as keyof PhraseKeys
          ] as PhraseKeys[keyof PhraseKeys]) = initJSONPhraseKeys[
            phraseKey as keyof PhraseKeys
          ] as PhraseKeys[keyof PhraseKeys];
        }
      }
    }
    for (let phraseKey in localesJSONPhraseKeys) {
      if (!(staticStructure.structure as any)?.[phraseKey as keyof PhraseKeys]) {
        const partialLocalesJSON = localesJSONPhraseKeys as Partial<PhraseKeys>;
        const partialDebugInfo =
          localesJSON.phraseKeyDebugInfo as Partial<PhraseKeyDebugInfo>;
        delete partialLocalesJSON[phraseKey as keyof PhraseKeys];
        delete partialDebugInfo[phraseKey as keyof PhraseKeys];
      }
    }
  }
  return localesJSON;
};

export const syncText = async (): Promise<LocalizedPhrases> => {
  try {
    const buildLastSha = await AsyncStorage.getItem(
      `${FLORO_TEXT_LAST_SHA_BUILD_PREFIX}:${metaFloro.sha}`,
    );
    const lastTextString = buildLastSha
      ? await AsyncStorage.getItem(`${FLORO_TEXT_BUILD_PREFIX}:${buildLastSha}`)
      : null;
    const lastText = lastTextString
      ? (JSON.parse(lastTextString) as LocalizedPhrases)
      : (initText as LocalizedPhrases);
    const branchRequest = await fetch(
      `${API_HOST}/public/api/v0/repository/${metaFloro.repositoryId}/branch/main`,
      {
        headers: {
          ['floro-api-key']: API_KEY,
        },
      },
    );
    const branchResponse = await branchRequest.json();
    const lastCommit = branchResponse?.branch?.lastCommit;
    if (!lastCommit) {
      return lastText;
    }
    if (lastCommit == metaFloro.sha) {
      return initText as LocalizedPhrases;
    }
    if (!!buildLastSha && lastCommit == buildLastSha) {
      return lastText;
    }
    const currentKey = `${FLORO_TEXT_BUILD_PREFIX}:${metaFloro.sha}`;
    const currentString = await AsyncStorage.getItem(currentKey);
    if (currentString) {
      return JSON.parse(currentString) as LocalizedPhrases;
    }
    const stateLinkRequest = await fetch(
      `${API_HOST}/public/api/v0/repository/${metaFloro.repositoryId}/commit/${lastCommit}/stateLink`,
      {
        headers: {
          ['floro-api-key']: API_KEY,
        },
      },
    );
    const stateLinkResponse = await stateLinkRequest.json();
    const stateLink = stateLinkResponse.stateLink;
    if (!stateLink) {
      return lastText;
    }
    const stateRequest = await fetch(stateLink);
    const state = await stateRequest.json();
    if (!state?.store?.text) {
      return lastText;
    }
    const textUpdateJSON: LocalizedPhrases = await getJSON(state.store);
    const textUpdate = getUpdatedText(textUpdateJSON);
    const keys = await AsyncStorage.getAllKeys();
    const keysToEvict = keys.filter(key => {
      return (
        key.startsWith(FLORO_TEXT_PREFIX) &&
        !key.startsWith(FLORO_TEXT_BUILD_PREFIX)
      );
    });

    for (let keyToEvict of keysToEvict) {
      AsyncStorage.removeItem(keyToEvict);
    }

    await AsyncStorage.setItem(
      `${FLORO_TEXT_BUILD_PREFIX}:${lastCommit}`,
      JSON.stringify(textUpdate),
    );
    await AsyncStorage.setItem(
      `${FLORO_TEXT_LAST_SHA_BUILD_PREFIX}:${metaFloro.sha}`,
      lastCommit,
    );
    return textUpdate;
  } catch (e) {
    const buildLastSha = await AsyncStorage.getItem(
      `${FLORO_TEXT_LAST_SHA_BUILD_PREFIX}:${metaFloro.sha}`,
    );
    const lastTextString = buildLastSha
      ? await AsyncStorage.getItem(`${FLORO_TEXT_BUILD_PREFIX}:${buildLastSha}`)
      : null;
    return lastTextString
      ? (JSON.parse(lastTextString) as LocalizedPhrases)
      : (initText as LocalizedPhrases);
  }
};
