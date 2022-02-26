# TrueBlocks Docker

<img src="https://avatars1.githubusercontent.com/u/19167586?s=200&v=4" width="50px" />

## Table of Contents
  - [Introduction](#introduction)
  - [Prerequisite](#prerequisite)
  - [Building](#building)
  - [Contributing](#contributing-to-trueblocks)
  - [List of Contributors](#contributors)
  - [Contact](#contact)

## Introduction

TrueBlocks docker allows you to run our backend in a docker container. The backend creates an index of 'every appearance of every address anywhere on the chain.' This turns your node software from a lump of coal into an Ethereum data server that can support true distributed applications that are trust-less and fast.

## Prerequisite

- In order to work to its fullest potential, TrueBlocks requires you to have access to the RPC endpoint of an Ethereum archive/tracing node. There are various commercially available offerings, or much more to our liking, you can run [Erigon](https://github.com/ledgerwatch/erigon). Erigon is easy to install and can be run on your own machine or (more easily) on [dAppNode](https://github.com/dappnode) or [Avado](#).
- A docker build environment is required.

## Building

A `Dockerfile` is included in this repo as an example for creating a Docker image.

1. Build a docker image (example tagged with `latest`)
  ```bash
  docker build . --tag=trueblocks-core:latest
  ```

2. Run chifra from the docker container (Examples:)
  ```bash
  # Running a simple chifra command
  docker run trueblocks-core:latest chifra
  # ...you should get the chifra help screen

  # Mounting your local config, cache, and index folders and running
  # chifra init (assumes chifra is working on host machine)
  docker run \
    -v ./trueblocks:/root/.local/share/trueblocks \
    -v ./cache:/root/.local/share/trueblocks/cache \
    -v ./unchained:/root/.local/share/trueblocks/unchained \
    trueblocks-core:latest chifra init

  # Mounting those same folders and starting the chifra API server
  docker run \
    -v ./trueblocks:/root/.local/share/trueblocks \
    -v ./cache:/root/.local/share/trueblocks/cache \
    -v ./unchained:/root/.local/share/trueblocks/unchained \
    trueblocks-core:latest chifra serve --port 0.0.0.0:8080
  ```

## Contributing to TrueBlocks

---
We love contributors. Please see information about our [work flow](./docs/BRANCHING.md) before proceeding.

1. Fork this repository into your own repo.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make changes to your local branch and commit them to your forked repo: `git commit -m '<commit_message>'`
4. Push back to the original branch: `git push origin TrueBlocks/trueblocks-core`
5. Create the pull request.

## Contributors

---
Thanks to the following people who have contributed to this project:

* [@tjayrush](https://github.com/tjayrush)
* [@dszlachta](https://github.com/dszlachta)
* [@wildmolasses](https://github.com/wildmolasses)
* [@MysticRyuujin](https://github.com/MysticRyuujin)

## Contact

---
If you have specific requests, contact us here <info@quickblocks.io>.

## Getting started

```[bash]
git clone -b develop https://github.com/TrueBlocks/trueblocks-docker
cd trueblocks-docker
[Edit `trueblocks.local.env using the notes in that file for more information.]
yarn start
```

`yarn start` should build the docker image and start it running. If this is the first time you've used it, it will download a C++ build environment, clone the TrueBlocks backend, and build the entire project. This takes about 30 minutes. Be patient.

The first time the TrueBlocks backend starts, it will download about 1 GB of bloom filters from IPFS. This is an optional task, but greatly speeds up your use of the software. You may disable this option by commenting out the `chifra init &` line in the Dockerfile file. If you do that, it will take about two days for TrueBlocks to build its initial version of the index.

For more information about downloading the index blooms from IPFS vs. building them yourself, please [see our docs](https://docs.trueblocks.io).

## Getting data

The docker portion of TrueBlocks starts an API that gives you easy access to make queries against its index.

Examples:

- Get all JSON exported for specific address:
  - `curl http://localhost:8080/export?address=0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359`
- Get {blockNumber, txIndex} pairs for specific address:
  - `curl http://localhost:8080/list?address=0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359`

---

## The remaining part of this doc is out of date but preserved for our future reference.

---

## Running on DappNode

Building and running the TrueBlocks docker image is taken care of by the dAppNode package manager. If you are running a dAppNode, you can simply install the package from the dAppNode package manager.

Note: your DappNode doesn't run Parity with `--tracing=on` by default. Set `EXTRA_OPTS=--tracing on` in the dappnode admin panel ([image](https://user-images.githubusercontent.com/21328788/52904014-04ab6c00-3226-11e9-8c47-747a42b22169.png)) or setting it in DNP_ETHCHAIN's ethchain.dnp.dappnode.eth.env file (see [Why do we need --tracing enabled?](#why-do-we-need-tracing-enabled))

## FAQ

### I'm running geth, do I need to run Parity instead?

Yes - Parity delivers the necessary articulated traces so that TrueBlocks can build its address index. We don't yet support Geth.

### What is my RPC endpoint?

That depends on how you've configured your parity node. some endpoints that we use are <http://172.17.0.1:8545> (when running node on linux host), <http://docker.for.mac.localhost:8545> (when running node on mac host), and <http://my.ethchain.public.dappnode.eth:8545> (when running node on dappnode). <http://localhost:8545> is a common guess, but docker has its own networking paradigm; don't be surprised if this RPC endpoint choice doesn't yield results.

Parity's default http RPC port is 8545, but your node could be configured differently.

### Why does it take so long to build the index?

TrueBlocks has to manually process every single block in the history of the Ethereum chain. Additionally, it has to descend into every transaction trace. Often, traces are deeply layered (traces of traces of traces of ... traces), and this takes time to 1) fetch from your node's RPC and 2) extract addresses.

### Why do we need tracing enabled?

By visiting every bit of the Ethereum data including blocks, transactions, receipts, logs, traces, trace actions, and trace results for every block, TrueBlocks is able to extract every 'appearance' of an address on the blockchain. TrueBlocks can only do this with a tracing node.

### How do you recommend I run a node?

You can run a node with the [DNP_ETHCHAIN](https://github.com/dappnode/DNP_ETHCHAIN) package - set `EXTRA_OPTS=--tracing on` in the dappnode admin panel or setting it in DNP_ETHCHAIN's ethchain.dnp.dappnode.eth.env file (see [Why do we need --tracing enabled?](#why-do-we-need-tracing-enabled))

Otherwise, in order for TrueBlocks to work properly, you need to start parity with at least the following options:

```
parity --tracing on --jsonrpc-cors all --jsonrpc-hosts all --db-compaction=ssd
```

`--db-compaction=ssd` is optional, but Parity recommends using an SSD drive for storing its data. Enabling `--tracing on` requires a re-sync of your node.

We also recommend (although, this is optional) that you specify an alternative path to store Parity's data (this will also require a re-sync of your node). We suggest an external 4TB SSD.

```
--db-path=/path/to/larger/hard/drive/      ; optionally add to the command line
```

Finally, TrueBlocks works equally with both tracing and archive nodes. You may start Parity as an archive node by adding the following option:

```
--pruning archive                          ; optionally add to the command line
```

(You will definitely want to use a larger hard drive in this case.)

## Troubleshooting

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

- **Thomas Jay Rush** - [tjayrush](https://github.com/tjayrush)
- **Ed Mazurek** - [wildmolasses](https://github.com/wildmolasses)

See also the list of [contributors](https://github.com/Great-Hill-Corporation/trueblocks-docker/contributors) who participated in this project.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details

## References

[git](https://git-scm.com/)

[docker](https://www.docker.com/)

[docker-compose](https://docs.docker.com/compose/)

[TrueBlocks](https://www.trueblocks.io/)
