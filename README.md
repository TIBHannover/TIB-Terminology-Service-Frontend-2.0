# TIB Terminology Service

This project was created with React 17.0

### Prerequisites

In order to run the frontend, ensure that Node.js is installed (version ^14.13.1 || >=16.0.0). Check whether you have the right version installed using your command prompt or terminal, run: `node --version`. For more information about installing or upgrading Node.js, see: https://nodejs.org/en/download/.

### Installation

Clone this repository:

    git clone https://git.tib.eu/terminology/tib-terminology-service-2.0

Go to the frontend directory:

    cd tib-terminology-service-2.0

Install the dependencies by running:

    npm install

## Running

Run the following command:

    npm start 

Open the browser and enter the URL of the application: http://localhost:3000/.

## Changing project environment

The default value in the [.env](https://git.tib.eu/terminology/tib-terminology-service-2.0/-/blob/master/.env) file is "general" to display TIB Terminology service. However, users can see other projects in the TIB environment collection by changing the project ID to their desired project ( eg. NFDI4Chem, NFDI4Ing). In order to fully transition to a new project view, users can also change the API endpoints, see selected project stats and project-filtered ontologies in the .env file.


## Convention on Issue Reporting
We use labels to indicate the status of an issue in the development process

Ready for testing
Task of the issues has been implemented and is ready for testing on ols02.develop.service.tib.eu

Icebox
Features or issues that need more discussion or planning before they can be started. Features or issues that are currently out of scope or very low priority.

Labels for assigning issues to an overall topic
Predefined labels (all with capital letters) you can assign an issue to

SEARCH

TREEVIEW

METADATA





