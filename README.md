# Dataverse Frontend

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
[![Tests](https://github.com/IQSS/dataverse-frontend/actions/workflows/test.yml/badge.svg)](https://github.com/IQSS/dataverse-frontend/actions/workflows/test.yml)
[![Unit Tests Coverage](https://coveralls.io/repos/github/IQSS/dataverse-frontend/badge.svg?branch=develop)](https://coveralls.io/github/IQSS/dataverse-frontend?branch=develop)

## Getting Started

First install node >=16 and npm >=8. Recommended versions `node v19` and `npm v9`.

### `npm install`

Run this command to install the dependencies. You may see a message about vulnerabilities after running this command. \
Please check this announcement from Create React App repository https://github.com/facebook/create-react-app/issues/11174 .
These vulnerabilities won't be in the production build since they come from libraries only used during the development.

### `cd packages/design-system && npm run build`

Run this command to build the UI library. This is needed to be able to run the app.

## Available Scripts

In the project directory, you can run at any time:

### `npm start`

Runs the app in the development mode.  
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

The page will reload when you make changes.  
You may also see any lint errors in the console.

### `npm run test:unit`

Launches the test runner for the unit tests in the interactive watch mode.  
If you prefer to see the tests executing in cypress you can run `npm run cy:open-unit`  
You can check the coverage with `npm run test:coverage`

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run preview`

Locally preview the production build.

### `npm run test:e2e`

Launches the Cypress test runner for the end-to-end tests.  
If you prefer to see the tests executing in cypress you can run `npm run cy:open-e2e`

### `npm run lint`

Launches the linter. To automatically fix the errors run `npm run lint:fix`

### `npm run format`

Launches the prettier formatter. We recommend you to configure your IDE to run prettier on save.

### `npm run storybook`

Runs the Storybook in the development mode.

There are 2 Storybook instances, one for the Design System and one for the Dataverse Frontend.

Open [http://localhost:6006](http://localhost:6006) to view the Dataverse Frontend Storybook in your browser.  
Open [http://localhost:6007](http://localhost:6007) to view the Design System Storybook in your browser.

Note that both Storybook instances are also published to Chromatic:

- [Dataverse Frontend](https://www.chromatic.com/builds?appId=646f68aa9beb01b35c599acd)
- [Dataverse Design System](https://www.chromatic.com/builds?appId=646fbe232a8d3b501a1943f3)

## Local development environment

A containerized environment, oriented to local development, is available to be run from the repository.

This environment contains a dockerized instance of the Dataverse backend with its dependent services (database, mailserver, etc), as well as an npm development server running the SPA frontend (With code autoupdating).

This environment is intended for locally testing any functionality that requires access to the Dataverse API from the SPA frontend.

There is an Nginx reverse proxy container on top of the frontend and backend containers to avoid CORS issues while testing the application.

### Run the environment

Inside the `dev-env` folder, run the following command:

```
./run-env <dataverse_branch_name>
```

As the script argument, add the name of the Dataverse backend branch you want to deploy.

Note that both the branch and the associated tag in the docker registry must to be pre pushed, otherwise the script will fail.

If you are running the script for the first time, it may take a while, since `npm install` has to install all the dependencies. This can also happen if you added new dependencies to package.json.

Once the script has finished, you will be able to access Dataverse via:

- [http://localhost:8000/spa](http://localhost:8000/spa): SPA Frontend
- [http://localhost:8000](http://localhost:8000): Dataverse Backend and JSF Frontend

If you want to run the environment with aggregated test data (collections and datasets), run the following command:

```
./run-env <dataverse_branch_name> wd
```

_Note: The above command uses the dataverse-sample-data repository whose scripts occasionally fail, so the 'wd' option is currently unstable and not recommended._

### Remove the environment

To clean up your environment of any running environment containers, as well as any associated data volumes, run this script inside the `dev-env` folder:

```
./rm-env
```

## Deployment

Once the site is built through the `npm run build` command, it can be deployed in different ways to different types of infrastructure, depending on installation needs.

We are working to provide different preconfigured automated deployment options, seeking to support common use cases today for installing applications of this nature.

The current automated deployment options are available within the GitHub `deploy` workflow, which is designed to be run manually from GitHub Actions. The deployment option is selected via a dropdown menu, as well as the target environment.

### AWS S3 Deployment

This option will build and deploy the application to a remote S3 bucket.

For this workflow to work, a GitHub environment must be configured with the following environment secrets:

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_S3_BUCKET_NAME
- AWS_DEFAULT_REGION

Note that for the deployment to the S3 bucket to succeed, you must make the following changes to the bucket via the S3 web interface (or equivalent changes using aws-cli or similar tools):

- Under "Permissions", "Permissions overview", "Block public access (bucket settings)", click "Edit", then uncheck "Block all public access" and save.
- Under "Properties", "Static website hosting", click "Edit" and enable it. Change "Index document" and "Error document" to "index.html".
- Under "Bucket policy", click "Edit" and paste the following policy (changing `<BUCKET_NAME>` to your bucket name) and save.

```
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicReadGetObject",
			"Principal": "*",
			"Effect": "Allow",
			"Action": [
				"s3:GetObject"
			],
			"Resource": [
				"arn:aws:s3:::<BUCKET_NAME>/*"
			]
		}
	]
}
```

You should see the deployed app at http://BUCKET-NAME.s3-website-REGION.amazonaws.com such as http://mybucket.s3-website-us-east-1.amazonaws.com

### Payara Deployment

This option will build and deploy the application to a remote Payara server.

This option is intended for an "all-in-one" solution, where the Dataverse backend application and the frontend application run on the same Payara server.

For this workflow to work, a GitHub environment must be configured with the following environment secrets:

- PAYARA_INSTANCE_HOST
- PAYARA_INSTANCE_USERNAME
- PAYARA_INSTANCE_SSH_PRIVATE_KEY

It is important that the remote instance is correctly pre-configured, with the Payara server running, and a service account for Dataverse with the corresponding SSH key pair established.

A base path for the frontend application can be established on the remote server by setting the corresponding field in the workflow inputs. This mechanism prevents conflicts between the frontend application and any pre-existing deployed application running on Payara, which can potentially be a Dataverse backend. This way, only the routes with the base path included will redirect to the frontend application.

## Changes from the Style Guide

The design system and frontend in this repo are inspired by the Dataverse Project [Style Guide](https://guides.dataverse.org/en/latest/style/index.html), but the following changes have been made, especially for accessibility.

### Links

We added an underline to links to make them accessible.

### File label

Now we are using Bootstrap with a theme, so there is only one definition for the secondary color. Since Bootstrap applies
the secondary color to the labels automatically, the color of the file label is now the global secondary color which is
a lighter shade of grey than what it used to be.

We changed the citation block to be white with a colored border, to make the text in the box more accessible.

## Thanks

<a href="https://www.chromatic.com/"><img src="https://user-images.githubusercontent.com/321738/84662277-e3db4f80-af1b-11ea-88f5-91d67a5e59f6.png" width="153" height="30" alt="Chromatic" /></a>

Thanks to [Chromatic](https://www.chromatic.com/) for providing the visual testing platform that helps us review UI changes and catch visual regressions.
