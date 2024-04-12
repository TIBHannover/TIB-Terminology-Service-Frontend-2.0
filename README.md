# TIB Terminology Service Frontend

This project was created with React 17.0

Public URL : https://terminology.tib.eu/ts

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



## Customization

The application can be customized to look different based on your needs. You can customize:
- Styles (css)
- Static contents: Homepage, Help, About, etc. 
- Application Env variables.

**Note**: You can customize the app in your config repository for deploying the application. The idea is to replace some default files and scripts with your custom content.


### Customize Style
The application CSS styles can be found in *src/components/layout*

To cutomize the app look, you need to create a new css file named **custom.css** inside the layout directory. You can overwrite the existing classes CSS in that file. 

**Hint**: It is recommended to use **!important** for your css to make sure it overwrites the existing classes. (Including Bootstrap classes) 

### Customize Static Contents and Logos
To customize the static content such as HomePage, you need to replace the corresponding JSX file that returns the content with yours.

As a general pattern, the contents are return values for some functions. One need to overwrite the return values to change the static contents. 

- Site Logo: Copy your site logo inside the *public* directory and name it **site_logo.png**

- HomePage: Inside the *src/components/Home* directory, replace **HomePageContent.jsx** with yours. **Note**, do not change the namings, just change the return value for the function **renderHomePage()**

- Help Page: Inside the *src/components/Help* directory, replace **HelpPageContent.jsx** with yours. **Note**, do not change the namings, just change the return value for the function **renderHelpPage()**

- About Page: Inside the *src/components/About* directory, replace **AboutPageContent.jsx** with yours. **Note**, do not change the namings, just change the return value for the function **renderAboutPage()**

- Documentation (API) Page: Inside the *src/components/Documentation* directory, replace **DocPageContent.jsx** with yours. **Note**, do not change the namings, just change the return value for the function **renderDocumentation()**

- Footer Content: Inside the *src/components/common/Footer* directory, replace **Footer.js** with yours.


### Changing project environment

The default value in the [.env](https://git.tib.eu/terminology/tib-terminology-service-2.0/-/blob/master/.env) file is "general" to display TIB Terminology service. However, users can see other projects in the TIB environment collection by changing the project ID to their desired project ( eg. NFDI4Chem, NFDI4Ing). In order to fully transition to a new project view, users can also change the API endpoints, see selected project stats and project-filtered ontologies in the .env file.



## Conventions on Issue Reporting
We use labels to indicate the status of an issue in the development process

Ready for testing
Task of the issues has been implemented and is ready for testing on ols02.develop.service.tib.eu

Icebox
Features or issues that need more discussion or planning before they can be started. Features or issues that are currently out of scope or very low priority.

Labels for assigning issues to an overall topic
Predefined labels (all with capital letters) you can assign an issue to

SEARCH
Issues related to all aspects of the search, including the result page, filter, advanced search, autosuggest or search in a single ontology

TREEVIEW
Issues related to the treeview of an ontology, ontology classes, properties or individuals

METADATA
Issues related to metadata content shown on various occasions on the pages

## Conventions on Moving Issues through the Development Workflow
Issues with the label Ready-for-testing are tested by 1-n members of the team, preferebly the reporter of the issue. Once tested successfully the issue will be labelled as Ready-to-Deploy 


## Deployment and branches

Test branch: used for testing the new features

Master branch: The deployment branch for production.

### How to develop a new feature/bug?

We first create a new branch from "master" branch. After finishing, we merge the branch first to the Test branch for testing. If the test is accepted, then we merge the branch to the master and remove it. 


**Important** Please always create the new branch from the "master" branch




