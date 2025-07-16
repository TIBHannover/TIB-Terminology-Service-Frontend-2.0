# TIB Terminology Service Frontend

Frontend application to support OLS-based terminology service.

Hosted on:

- https://terminology.tib.eu/ts (TIB)
- https://terminology.nfdi4chem.de/ts/ (NFDI4Chem)
- https://terminology.nfdi4ing.de/ts/ (NFDI4Ing)

Features:

- Access the latest versions of the most relevant terminologies from chemistry, engineering, architecture and many more
  domains.
- Explore domain knowledge via concept hierarchies, find synonyms, translations of terms (via API), look up definitions,
  and retrieve a concept’s persistent identifier.
- Use TIB Terminology Service data (JSON) in your own service or application via REST API.
- Suggest your own or other ontologies to be indexed in TIB Terminology Service.

### Installation

Install the dependencies by running:

    npm install

## Running

After initiating the .env variables with proper values then run:

    npm start 

Open the browser and enter the URL of the application: http://localhost:3000/.

## Customization

The application can be customized to look different based on your needs. You can customize:

- Styles (css)
- Static contents: Homepage, Help, About, etc.
- Application Env variables.

**Note**: You can customize the app in your config repository for deploying the application. The idea is to replace some
default files and scripts with your custom content.

### Customize Style

The application CSS styles can be found in *src/components/layout*

To cutomize the app look, you need to create a new css file named **custom.css** inside the layout directory. You can
overwrite the existing classes CSS in that file.

**Hint**: It is recommended to use **!important** for your css to make sure it overwrites the existing classes. (
Including Bootstrap classes)

### Customize Static Contents and Logos

To customize the static content such as HomePage, you need to replace the corresponding JSX file that returns the
content with yours.

As a general pattern, the contents are return values for some functions. One need to overwrite the return values to
change the static contents.

- Site Logo: Copy your site logo inside the *public* directory and name it **site_logo.png**

- HomePage: Inside the *src/components/Home* directory, replace **HomePageContent.jsx** with yours. **Note**, do not
  change the namings, just change the return value for the function **renderHomePage()**

- Help Page: Inside the *src/components/Help* directory, replace **HelpPageContent.jsx** with yours. **Note**, do not
  change the namings, just change the return value for the function **renderHelpPage()**

- About Page: Inside the *src/components/About* directory, replace **AboutPageContent.jsx** with yours. **Note**, do not
  change the namings, just change the return value for the function **renderAboutPage()**

- Documentation (API) Page: Inside the *src/components/Documentation* directory, replace **DocPageContent.jsx** with
  yours. **Note**, do not change the namings, just change the return value for the function **renderDocumentation()**

- Footer Content: Inside the *src/components/common/Footer* directory, replace **Footer.js** with yours.

### Changing project environment

The default value in the [.env](https://git.tib.eu/terminology/tib-terminology-service-2.0/-/blob/master/.env) file is "
general" to display TIB Terminology service. However, users can see other projects in the TIB environment collection by
changing the project ID to their desired project ( eg. NFDI4Chem, NFDI4Ing). In order to fully transition to a new
project view, users can also change the API endpoints, see selected project stats and project-filtered ontologies in the
.env file.

### Run Test

Playwrite have been used for testing this application. To run test for Firefox:

```
npx playwrite test --project=firefox
```

you can also use **chromium** and **webkit** for Chrome and Safari. 



