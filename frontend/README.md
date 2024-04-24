# CoHelm Coding Assessment - Frontend

This folder defines the components that make up the frontend of the CoHelm coding assessment challenge. This application represents a simulated vertical slice of the products offered by CoHelm.

## Before You Begin
This project uses Node.js and NPM to define a frontend application that accepts some file uploads and displays a page of resulting case data once the upload is completed.
Ensure you have both Node.js and npm installed before you proceed. Package managers such as apt-get for Ubuntu or Homebrew for macOS make the installation easy.

### Installing Node.js and npm using apt-get:

```bash
sudo apt-get update
sudo apt-get install nodejs npm
```

### Installing Node.js and npm using Homebrew (Note: in Homebrew, npm is included by default when installing Node.js):
```bash
brew update
brew install node
```

## Preparing your project
This project uses npm to manage dependencies, so make sure to install your dependencies before you attempt to run the application for the first time.

### Installing dependencies via npm (make sure to navigate to the directory that contains package.json first):
```bash
npm install
```

## Running the project locally:
```bash
npm run dev
```

You should see output resembling the following:
```bash
> product-engineer-starter@0.1.0 dev
> next dev

  ▲ Next.js 13.5.6
  - Local:        http://localhost:3000

 ✓ Ready in 1370ms
 ```
 
 This tells you the frontend is now available to navigate to on your localhost at the address http://localhost:3000. You should now be able to navigate to http://localhost:3000 in a web browser and see the dashboard.