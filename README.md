## Stupid VR Viewer for vglist

A stupid VR viewer for your [vglist](https://vglist.co) library.

Built with [A-Frame](https://aframe.io).

Setup Instructions:

- `yarn install` - Install dependencies.
- Set `VGLIST_USER_EMAIL` and `VGLIST_API_TOKEN` environment variables with your account's email address and API token respectively.
- `yarn run start` - Start the webpack server and serve the site locally.
- `yarn run watch` - In another tab, run the webpack watcher that'll compile the JavaScript in the `dist/` directory.

Now you can open your browser to http://localhost:5000 and the site will be available.
