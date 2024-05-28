# Search UI sandbox

This sandbox app is a simple example of how to use the Search UI library and also serves as a development aid.

See the [Contributing guide](../../CONTRIBUTING.md#sandbox) for the instructions on running the sandbox.

A live version can be found [here](https://codesandbox.io/s/github/elastic/search-ui/tree/main/examples/sandbox).

## Prerequisites

- `nodejs` >20: 
  - you can install it using `nvm`, see https://github.com/nvm-sh/nvm/blob/master/README.md#install--update-script:

    > To install or update nvm, you should run the install script. To do that, you may either download and run the script manually, or use the following cURL or Wget command:
    >
    > ```curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash```
    >
    > ```wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash```
  - you might have to open a new terminal to get the env variables properly set, then run:
    ```
    nvm install 20
    ```
  - in the following we'll assume `node -v` returns `20.x.y`, if not just run:
    ```
    nvm use 20
    ```
- `yarn`: 
  - see https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable:

    > It is recommended to install Yarn through the npm package manager, which comes bundled with Node.js when you install it on your system.
    >
    > Once you have npm installed you can run the following both to install and upgrade Yarn:
    >
    > ```npm install --global yarn```

## Installation

Open a terminal in the project directory and run:
```
yarn
```

## Startup

Open a terminal in the project directory and run:
```
yarn start
```
It should open a window in the browser, pointing at `http://localhost:3000`.
