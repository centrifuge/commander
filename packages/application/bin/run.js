#!/usr/bin/env -S node --experimental-json-modules

import { Application } from '@centrifuge-commander/application';

await new Application().run();
