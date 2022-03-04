import inquirer, { ConfirmQuestion, ListQuestion } from 'inquirer';
//import { Application } from '../application.js';
import { CloudProviderType, LanguageType } from '../types.js';
import { colors } from '@centrifuge-commander/core/colors';
import { AWSConfigurationWizard } from './cloud.js';

/* basic preferences data */
interface BasicPreferences {
  language?: LanguageType;
  commandCompletion?: boolean;
}

export interface WelcomeWizardData extends BasicPreferences {
  initialization?: boolean;
  providerName?: CloudProviderType;
}

/**
 * Application's initialization wizard.
 *
 * This wizard helps setting up application's parameters and preferences
 * when launching the latter for the first time.
 *
 * @Example
 * ```typescript
 * await WelcomeWizard().run()
 * ```
 */
export class WelcomeWizard {
  /**
   * Run first time welcome wizard.
   */
  public static async run() {
    console.log('Welcome to Centrifuge CLI\n');

    try {
      let answers: WelcomeWizardData;

      answers = await inquirer.prompt<WelcomeWizardData>(WelcomeWizard.confirmInitializationQuestion());
      if (!answers.initialization) {
        console.log(`\n  ${colors.redBright('Gotcha! Goodbye!')}`);
        process.exit(1);
      }

      /* gather basic preferences */
      answers = await inquirer.prompt<BasicPreferences>(WelcomeWizard.setBasicPreferencesQuestion());

      /* choose and setup cloud provider */
      // eslint-disable-next-line prettier/prettier
      answers = await inquirer.prompt<WelcomeWizardData>(WelcomeWizard.chooseCloudProviderQuestion());
      await WelcomeWizard.configureCloudProvider(answers.providerName);

      console.log(`Initialization is ${colors.greenBright('successful')} and language: ${answers.language?.toString()}`);

    } catch (error) {
      console.error('Error during initialization wizard execution');
    }
  }

  // --------------------------------------------------------------------------
  // Wizard questions
  // --------------------------------------------------------------------------

  /*
   * Confirm or cancel application's initialization process.
   */
  private static confirmInitializationQuestion(): ListQuestion {
    return {
      type: 'list',
      name: 'initialization',
      message: `${colors.yellow('Centrifuge CLI is not initialized yet! Would you like to proceed?')}`,
      choices: ['yes', 'no'],
      default: 'yes',
    };
  }

  /*
   * Gather basic preferences.
   */
  private static setBasicPreferencesQuestion(
    defaultLanguage: LanguageType = 'en',
    defaultCompletion = true,
  ): (ListQuestion | ConfirmQuestion)[] {
    return [
      {
        type: 'list',
        name: 'language',
        message: 'Select your language',
        choices: ['en', 'fr', 'de'],
        default: defaultLanguage,
      },
      {
        type: 'confirm',
        name: 'commandCompletion',
        message: 'Would you like to setup command line completion?',
        default: defaultCompletion,
      },
    ];
  }

  /* Choose the cloud platform on which to deploy Centrifuge components */
  private static chooseCloudProviderQuestion(defaultProvider: CloudProviderType = 'aws'): ListQuestion {
    return {
      type: 'list',
      name: 'providerName',
      message: 'Choose your cloud provider',
      choices: ['aws', 'gcp', 'azure'],
      default: defaultProvider,
    };
  }

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------

  /*
   * Configure given cloud provider.
   *
   * @param providerName Name of the provider to be configured.
   */
  private static async configureCloudProvider(providerName: CloudProviderType) {
    switch (providerName) {
      case 'aws':
        await AWSConfigurationWizard.run();
        break;
      case 'azure':
        break;
      case 'gcp':
        break;
      default:
        throw Error('Unknown cloud provider! You should not reach this line');
    }
  }
}
