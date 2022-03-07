# Welcome to Centrifuge Commander

With Centrifuge `Commander`, you have the overall Centrifuge ecosystem at your fingertips. Among others, it provides with a local development sandbox for Rust, a command for bootstraping a local Centrifuge network, with a relay chain and one or more parachains, and more. It is an intuitive and easy to use command-line interface (CLI) that help you land and work efficiently with Centrifuge chain and dapps.

## Building Centrifuge Commander

Building Centrifuge Commander is simple:

```sh
$ yarn
$ yarn build
```

## Run Commander locally

```sh
$ ./packages/application/bin/run.js --help
```

## Build on M1 machines

We have been facing issues trying to build this repo on Apple M1 machines.

Alternatively, you can opt to run it in a docker container:

```
# Build a node Docker container
docker container run --rm -it --volume `pwd`:/commander node bash;
cd commander

# Install dependencies
yarn

# Build the project
yarn build
```
