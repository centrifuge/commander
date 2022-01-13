import { readFileSync } from 'fs';

export function readJSONFile(filePath: string): Promise<never> {
  const rawData = readFileSync(filePath);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const outObject = JSON.parse(rawData.toString());

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return outObject;
}

