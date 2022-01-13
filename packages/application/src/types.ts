export type LanguageType = 'en' | 'fr' | 'de' | undefined;
export type CloudProviderType = 'aws' | 'azure' | 'gcp' | undefined;

export interface Settings {
  analytics?: boolean;
  credentials?: object;
  language?: LanguageType;
  provider?: CloudProviderType;
}
