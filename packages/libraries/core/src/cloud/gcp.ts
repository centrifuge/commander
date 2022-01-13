/**
 * Google cloud platform (GCP) provider class.
 *
 * A lean abstraction over GCP services used to implement
 * the CLI commands.
 */
export class GoogleCloudProvider {
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
}
