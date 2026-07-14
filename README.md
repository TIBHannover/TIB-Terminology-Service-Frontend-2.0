# TIB Terminology Service Frontend

Frontend application to support OLS-based terminology service.

Hosted on:

- https://terminology.tib.eu/ts (TIB)
- https://terminology.nfdi4chem.de/ts/ (NFDI4Chem)
- https://terminology.nfdi4ing.de/ts/ (NFDI4Ing)

Features:

- Access the latest versions of the most relevant terminologies from chemistry, engineering, architecture and many more
  domains.
- Explore domain knowledge via concept hierarchies, find synonyms, translations of terms, look up definitions,
  and retrieve a concept’s persistent identifier.
- Use TIB Terminology Service data in your own service or application via **REST API**.
- **Suggest** your own or other ontologies to be indexed in TIB Terminology Service.
- Define Ontology **collections** to organize your ontologies and make them searchable.
- Define **Termsets** to organize your terms and make them shareable.
- Visualize your ontologies and terms in a **graph** view.
- Check the history of changes to your ontologies and terms.


### Installation

Install the dependencies by running:

    bun run install

## Running

After initiating the .env variables with proper values then run:

    bun run start 

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

- Site Logo: Copy your site logo inside the *public* directory and set the REACT_APP_SITE_LOGO environment variable to the name of the file.

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

The default value in the .env file.

### Run Test

Playwright have been used for testing this application.

```
bun run mock-backend # to start the mock backend

bun run test:all
bun run test:desktop
bun run test:one # only for chromium
bun run test:mobile
```




