import { DescribeRegionsCommand, DescribeRegionsResult, EC2Client } from '@aws-sdk/client-ec2';
import { existsSync, readFileSync } from 'fs';
import ini from 'ini';
import { homedir } from 'os';
import { normalize, join } from 'path';

export type ProfileNames = { [key: string]: string };
export interface ProfileCredentials<Value> {
  [key: string]: Value;
}
export interface NamedProfiles<Value> {
  [key: string]: Value;
}

export interface AWSCredentials {
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;
  sessionToken?: string;
}

/**
 * Amazon Web Services (AWS) cloud provider errors.
 */
export class AWSCloudProviderErrors {
  public static readonly ErrorInvalidAccessKeyId =
    'Access Key ID must be 20 characters and uppercase alphanumeric only.';
  public static readonly ErrorInvalidSecretAccessKey =
    'Secret Access Key must be 40 characters, and base-64 string only.';
}

/**
 * Amazon Web Services (AWS) cloud provider class.
 *
 * A lean abstraction over Amazon AWS cloud platform.
 */
export class AWSCloudProvider {
  private static readonly DefaultRegion = 'us-east-1';
  private static readonly Ec2Client: EC2Client = new EC2Client({ region: AWSCloudProvider.DefaultRegion });

  /* Path constants definition */
  private static readonly ConfigDirectoryPath = '.aws';
  private static readonly ConfigFileName = 'config';
  private static readonly CredentialsFileName = 'credentials';

  /**
   * Return the list of available regions.
   *
   * @returns {Map<string,string>} A map containing the list of available regions with a description.
   */
  public static getAvailableRegions(): Record<string, string> {
    return {
      'us-east-1': 'US East (N. Virginia)',
      'us-east-2': 'US East (Ohio)',
      'us-west-1': 'US West (N. California)',
      'us-west-2': 'US West (Oregon)',
      'eu-north-1': 'EU (Stockholm)',
      'eu-west-1': 'EU (Ireland)',
      'eu-west-2': 'EU (London)',
      'eu-west-3': 'EU (Paris)',
      'eu-central-1': 'EU (Frankfurt)',
      'ap-northeast-1': 'Asia Pacific (Tokyo)',
      'ap-northeast-2': 'Asia Pacific (Seoul)',
      'ap-southeast-1': 'Asia Pacific (Singapore)',
      'ap-southeast-2': 'Asia Pacific (Sydney)',
      'ap-south-1': 'Asia Pacific (Mumbai)',
      'ca-central-1': 'Canada (Central)',
      'me-south-1': 'Middle East (Bahrain)',
      'sa-east-1': 'South America (São Paulo)',
    };
  }

  /**
   * Detect user's AWS access credentials.
   *
   * This method tries to detect access credentials. The latter can be defined
   * using environment variables (i.e. AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
   * or configuration files (i.e. '~/.aws/credentials').
   *
   * @returns true if an AWS account with credentials is detected, or false otherwise.
   */
  public static detectUserCredentials(): boolean {
    let result = false;

    if (existsSync(AWSCloudProvider.getCredentialsFilePath())) {
      result = true;
    } else {
      result = false;
    }

    return result;
  }

  /**
   * Return the names of all avalailable regions.
   *
   * @returns A list containing the names of all avaialable regions.
   */
  public static async getRegionNames(): Promise<string[] | undefined> {
    try {
      const result: DescribeRegionsResult = await AWSCloudProvider.Ec2Client.send(new DescribeRegionsCommand({}));

      const names: string[] = [];
      for (const region in result.Regions) {
        names.push(region);
      }

      return names;
    } catch (error) {
      console.log('Error');
    }
  }

  /**
   * Return AWS configuration profile names.
   *
   * This method parses user's AWS profiles from '~/.aws/config'
   * file.
   */
  public static getProfileNames(): string[] {
    const names: string[] = [];

    if (existsSync(AWSCloudProvider.getConfigFilePath())) {
      /* parse configuration file contents (encoded as '.ini' format)*/
      const entries = ini.parse(readFileSync(AWSCloudProvider.getConfigFilePath(), 'utf-8'));

      Object.keys(entries).forEach(key => {
        /* get rid of 'profile' prefix in keys (keeping the profile name only) */
        const profileName = key.replace('profile', '').trim();
        names.push(profileName);
      });
    }

    return names;
  }

  /**
   * Return named configuration profile objects.
   *
   * This method parses '~/.aws/config' file and returns an object for each
   * profile, deleting the 'profile' prefix from the profile name.
   *
   * @returns a list of configuration profile objects.
   * @see https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
   */
  public static getNamedProfiles(): NamedProfiles<string> {
    const namedProfiles = {} as NamedProfiles<string>;

    if (existsSync(AWSCloudProvider.getConfigFilePath())) {
      /* parse configuration file contents (encoded as '.ini' format)*/
      const entries = ini.parse(readFileSync(AWSCloudProvider.getConfigFilePath(), 'utf-8'));

      Object.keys(entries).forEach(key => {
        /* get rid of 'profile' prefix in keys (keeping the profile name only) */
        const profileName = key.replace('profile', '').trim();
        if (!namedProfiles[profileName]) {
          namedProfiles[profileName] = entries[key] as string;
        }
      });
    }

    return namedProfiles;
  }

  /**
   * Return profile configuration object.
   *
   * This method parses '~/.aws/config' file contents to find the given
   * profile and builds a resulting object.
   *
   * @param {string} profileName Name of the profile for which its config must be loaded.
   * @return An object containing profile configuration properties.
   */
  public static getProfileConfiguration(profileName: string): unknown {
    let profileConfiguration: unknown = {};

    console.log(`Load profile ${profileName} config from ${AWSCloudProvider.getConfigFilePath()}`);

    if (existsSync(AWSCloudProvider.getConfigFilePath())) {
      const properties = ini.parse(readFileSync(AWSCloudProvider.getConfigFilePath(), 'utf-8'));
      Object.keys(properties).forEach(key => {
        const keyName = key.replace('profile', '').trim();
        if (profileName === keyName) {
          /* add property to the profile configuration object */
          profileConfiguration = properties[key];
        }
      });
    }

    return profileConfiguration;
  }

  /**
   * Return credentials that are associated to a given AWS profile.
   *
   * This method parses '~/.aws/credentials' file contents to find the
   * given profile's access key id (i.e. 'aws_access_key_id') and secret
   * access key (i.e. 'aws_secret_access_key').
   */
  public static getProfileCredentials(profileName: string): ProfileCredentials<string> {
    let profileCredentials = {} as ProfileCredentials<string>;

    if (existsSync(AWSCloudProvider.getCredentialsFilePath())) {
      const properties = ini.parse(readFileSync(AWSCloudProvider.getCredentialsFilePath(), 'utf-8'));

      Object.keys(properties).forEach(key => {
        const keyName = key.trim();
        if (profileName === keyName) {
          /* add property to the resulting object containing credentials */
          profileCredentials = properties[key] as ProfileCredentials<string>;
        }
      });
    }

    /* rename credential properties to camel case notation (i.e. 'aws_access_key_id' becomes 'accessKeyId' property) */
    return AWSCloudProvider.normalizeCredentialProperties(profileCredentials);
  }

  /*
   * Normalize the names of credential properties.
   *
   * This method changes the names of credential properties stored in
   * '~/.aws/credentials' file to a camel case notation. For instance,
   * 'aws_access_key_id' name becomes 'accessKeyId' in {ProfileConfiguration}
   * object type.
   */
  private static normalizeCredentialProperties(credentials: ProfileCredentials<string>): ProfileCredentials<string> {
    const normalizedCredentials: ProfileCredentials<string> = {};

    if (credentials) {
      normalizedCredentials.accessKeyId = credentials.aww_access_key_id;
      normalizedCredentials.secretAccessKey = credentials.aws_secret_access_key;
      normalizedCredentials.sessionToken = credentials.aws_session_token;
    }

    return normalizedCredentials;
  }

  /**
   * Return the directory where AWS configuration files are stored.
   *
   * @return {string} a string containing the path to the configuration directory.
   */
  public static getConfigDirectoryPath(): string {
    return normalize(join(homedir(), AWSCloudProvider.ConfigDirectoryPath));
  }

  /**
   * Return the path of AWS configuration file.
   *
   * This file is usually stored in '~/.aws/config' on Unix flavors.
   */
  public static getConfigFilePath(): string {
    return normalize(join(AWSCloudProvider.getConfigDirectoryPath(), AWSCloudProvider.ConfigFileName));
  }

  /**
   * Return the path of AWS credentials file.
   *
   * This file is usually stored in '~/.aws/credentials' on Unix flavors.
   */
  public static getCredentialsFilePath(): string {
    return normalize(join(AWSCloudProvider.getConfigDirectoryPath(), AWSCloudProvider.CredentialsFileName));
  }
}
