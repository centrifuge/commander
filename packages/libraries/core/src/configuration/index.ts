import { Configuration } from './types';
import { validateConfiguration } from './schema';
import { readJSONFile } from '../utilities';
/**
 * Loads a configuration from a given configuration file path.
 *
 * @param filepath Path of the configuration file.
 * @returns {Promise<Configuration>} A promise with a {Configuration} object or {undefined} if something goes wrong.
 */
export async function loadConfigurationFile(filepath: string): Promise<Configuration | undefined> {
  console.log(`Loading JSON configuration file: ${filepath}`);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const jsonObject: Configuration = await readJSONFile(filepath);

  /* parse configuration's raw data and return a configuration object */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  if (!validateConfiguration(jsonObject)) {
    //let errorMessage = `${configParser.message} at line: ${configParser.position}`;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.error(`error: ${validateConfiguration.errors}`);

    return undefined;
  } else {
    console.log('Successful configuration parsing: ' + JSON.stringify(jsonObject));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return jsonObject;
  }
}
