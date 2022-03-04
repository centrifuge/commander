import inquirer, { ListQuestion, PasswordQuestion } from 'inquirer';
import { WelcomeWizardData } from './welcome';
import { AWSCloudProvider, AWSCloudProviderErrors } from '@centrifuge-commander/core/cloud/aws.js';
import { Obfuscator } from '@centrifuge-commander/core/obfuscator';

/**
 * Data gathered by AWS configuration wizard.
 */
export interface AWSConfigurationWizardData extends WelcomeWizardData {
  profile: string;
}

interface ProfileConfig {
  region?: string;
}

/**
 * Wizard used for configuring AWS cloud provider.
 *
 * @example
 * 
 * ```typescript
 * ```
 */
export class AWSConfigurationWizard {
  /**
   * Execute wizard steps.
   */
  public static async run() {
    let answers: AWSConfigurationWizardData = { profile: 'default' };

    /* detect AWS user account or credentials */
    if (!AWSCloudProvider.detectUserCredentials()) {
      await CreateNewUserAccountWizard.run();
    }

    const profileNames = AWSCloudProvider.getProfileNames() as string[];

    answers = await inquirer.prompt<AWSConfigurationWizardData>(
      AWSConfigurationWizard.chooseProfileQuestion(profileNames),
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const profileConfig = AWSCloudProvider.getProfileConfiguration(answers.profile) as ProfileConfig;
    console.log(`Profile: ${JSON.stringify(profileConfig)}`);
  }

  /*
   * Choose user's AWS profile.
   *
   * AWS profiles are usually defined in '~/.aws/config' and/or '~/.aws/credentials'
   * files.
   *
   * @param {string[]} a list of strings containing the names of the available AWS profiles.
   */
  private static chooseProfileQuestion(profileNames: string[], defaultProfile = ''): ListQuestion {
    return {
      type: 'list',
      name: 'profile',
      message: 'Please choose the AWS profile you want to use',
      choices: profileNames,
      default: defaultProfile,
    };
  }

  /**
   * Check if the given access key identifier is well-formed.
   *
   * @param id AWS access key identifier to be validated
   * @returns true if the identifier is well formed or false otherwise
   */
  public static validateAccessKeyId(id: string): boolean | string {
    const regexp = /^[A-Z0-9]{20}$/;
    return regexp.test(id) ? true : AWSCloudProviderErrors.ErrorInvalidAccessKeyId;
  }

  /**
   * Check if the given secrete access key is well-formed.
   *
   * @param id AWS secret access key to be validated
   * @returns true if the secret access key is well formed or false otherwise
   */
  public static validateSecretAccessKey(key: string): boolean | string {
    const regexp = /^[A-Za-z0-9/+=]{40}$/;
    return regexp.test(key) ? true : AWSCloudProviderErrors.ErrorInvalidSecretAccessKey;
  }
}

/*
 * Wizard used for creating a new AWS user account.
 */
class CreateNewUserAccountWizard {
  /**
   * Execute wizard steps.
   */
  public static async run() {
    const answers = await inquirer.prompt(await CreateNewUserAccountWizard.createNewUserQuestions());

    console.log('new user info: ' + JSON.stringify(answers));
  }

  /*
   * Create new AWS user questions.
   */
  private static async createNewUserQuestions(
    defaultRegion = 'eu-east-1',
    defaultAccessKey = 'none',
    defaultSecretAccessKey = 'none',
  ): Promise<(ListQuestion | PasswordQuestion)[]> {
    return [
      {
        type: 'list',
        name: 'createNewUser',
        message: 'No AWS account or credentials detected. Do you want to create a new AWS user account?',
        choices: ["yes", "no"],
        default: "yes",
      },
      {
        type: 'password',
        mask: '*',
        name: 'accessKeyId',
        message: 'accessKeyId: ',
        default: defaultAccessKey,
        validate: AWSConfigurationWizard.validateAccessKeyId.bind(this),
        transformer: Obfuscator.obfuscate,
        when(answers) {
          return answers.confirm === 'yes';
        },
      },
      {
        type: 'password',
        mask: '*',
        name: 'secretAccessKey',
        message: 'secretAccessKey: ',
        default: defaultSecretAccessKey,
        validate: AWSConfigurationWizard.validateSecretAccessKey.bind(this),
        transformer: Obfuscator.obfuscate,
        when(answers) {
          return answers.confirm === 'yes';
        },
      },
      {
        type: 'list',
        name: 'region',
        message: 'region: ',
        choices: await AWSCloudProvider.getRegionNames(),
        default: defaultRegion,
        when(answers) {
          return answers.confirm === 'yes';
        },
      },
    ];
  }
}
