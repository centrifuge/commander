#!/usr/bin/env node --experimental-json-modules

import { Application } from '@centrifuge-cli/application';

await new Application().run();
