# FTC TeamSniper

A Vue3 webapp that uses the FIRST API to find most recent team numbers because it was too much effort to use The Orange Alliance.

To run locally, simply open up your instance of `node`. Refer to the `.node-version` file for the version used for development, as it may change. 

Run `npm i` or `pnpm i` in both the `root` and `server` directories to install all dependencies.
Then run `npm run start` or `pnpm start` to start a linked Vite server. A development API server should be opened on port `3000`.

It's worth noting that the production server is hosted separately.

If you would like to use the Discord bot included in this repository, make sure you have your token and application set up. There is documentation online about how to do this. Then simply set your CLIENT_ID and API key in the `bot` directory.
