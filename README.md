# SolidQuery

<img src="https://kenshi.io/images/logo/logo.svg" alt="Kenshi" width="128">

SolidQuery is an innovative open-source project that generates a decentralized
database based on your unique data schema. Unlike traditional databases,
SolidQuery provides a highly customized and fully decentralized data management
solution for the Ethereum blockchain, allowing seamless integration with your
DApps.

This [demo](https://solidquery-library-demo.vercel.app/) stores and indexes all
its data on the Arbitrum mainnet. The generated contract is deployed as-is, with
no modifications.

## Key Features

- **Custom Schema Generation:** Define your data structure using YAML and let
  SolidQuery do the rest.
- **Decentralized Database:** Leverage the power of the Ethereum blockchain for
  your application's data management.
- **Data Indexing:** Built-in functionality for data indexing.
- **Solidity Event Emitting:** Automates the generation of Solidity events for
  data creation, update, and deletion.

Learn more about SolidQuery [here](https://kenshi.io/solidquery).

## How to Use

### Playground

You can find the SolidQuery playground [here](https://kenshi.io/solidquery/playground).

### Installation

```shell
npm install -g @kenshi.io/solidquery
```

### Usage

Create a YAML file to define your data schema. Run the following command to
generate the Solidity contract:

```shell
solidq schema.yaml MyContract.sol
```

![SolidQuery CLI](./assets/solidq.cli.png)

### Example Schema

```yaml
Book:
  Id: uint256 id auto
  Name: string
  Author: string indexed
  Published: uint256 indexed get set

Person:
  Name: string
  Birth: uint256 indexed

User:
  Address: address id
  Balance: uint256
```

is equivalent to

```yaml
Book:
  Id:
    type: uint256
    id: true
    auto: true
  Name: string
  Author:
    type: string
    indexed: true
    get: true
    set: true
  Published:
    type: uint256
    indexed: true

Person:
  Name: string
  Birth:
    type: uint256
    indexed: true

User:
  Address:
    type: address
    id: true
  Balance:
    type: uint256
```

You can learn the schema language [here](./schema.md).

![SolidQuery Demo](./assets/solidq.demo.png)

## Roadmap

We have planned the following features:

- Fine control over contract generation
- Array fields
- Relations
- Better indexing
- Range queries
- Multi-dimensional indexing

## Contributing

We welcome and appreciate all contributions. If you're interested in
contributing, please see our [Contributing Guide](CONTRIBUTING.md).

## License

SolidQuery is [Apache 2.0 licensed](LICENSE).

## Contact

Feel free to contact us at [our contact page](https://kenshi.io/contact) if you
have questions or need assistance.
