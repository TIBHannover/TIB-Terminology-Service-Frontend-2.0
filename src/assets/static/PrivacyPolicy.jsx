import React from 'react'


class PrivacyPolicy extends React.Component{
    render(){
      return(
            <div className='row justify-content-center'>
             <div className='col-sm-8'>
               <h2>Privacy Policy</h2>                          
                 <p>Data protection is of high priority for the Technische Informationsbibliothek (TIB). As a general rule, the use of TIB’s services does not require the provision of any personal data. However, the processing of personal data may be required where a data subject wants to use special services via the TIB’s web pages. Where the processing of personal data is required and where there is no legal basis for such processing, we shall obtain the data subject’s consent.<br/><br/>
                   The processing of personal data, such as for example the data subject’s name, address, email address, or telephone number shall always be carried out in accordance with the General Data Protection Regulation (GDPR) and the state and institution-specific data protection rules and regulations applicable to the TIB. This privacy statement serves to inform the public about the nature, scope and purpose of the personal data we collect, use and process, as well as of the rights data subjects are entitled to.<br/><br/>
                   The terms used in this privacy statement are to be understood within the meaning of the <a href="https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A32016R0679">European General Data Protection Regulation (GDPR)</a>.<br/>
                 </p>
                <br/>
               <h3>Name and address of the controller</h3>
                 <p>The controller under data protection law shall be:
					         <br /><br/>
					          Technische Informationsbibliothek (TIB)
					         <br />
					          Welfengarten 1 B
					         <br />
					          30167 Hannover
					         <br />
					          Germany
					         <br />
					          Phone: +49 511 762-8989
					         <br />
					          Email: <a href="mailto:information@tib.eu">information@tib.eu</a>
					         <br />
					          Website: <a href="www.tib.eu">www.tib.eu</a>
					         <br />

                 </p><br/>
               <h3>Name and address of the data protection officer</h3>
                 <p>The data protection officer of the controller shall be:
                     <br /><br/>
                    Elke Brehm
                     <br />
                    Phone: +49 511 762-8138
                     <br />
                    Email: <a href="mailto:datenschutz@tib.eu">datenschutz@tib.eu</a>
                     <br />
                 </p>
                 <br/>
               <h4>Postal Address:</h4>
                 <p>Technische Informationsbibliothek (TIB)
                   <br />
				          data protection officer
				           <br />
				          Welfengarten 1 B
				           <br />
				          30167 Hannover
				           <br />
				          Germany
                   <br /><br/>
                 </p>
               <h4>Visiting Address:</h4>
                 <p>TIB Conti-Campus
                   <br />
				         K&ouml;nigsworther Platz 1 B
				          <br />
				         30167 Hannover
                 <br />
                </p><br/>
                <p>Any data subject may contact our data protection officer directly regarding any and all questions and suggestions regarding data protection at any time.<br /></p>
                <br/>
            <h3>Cookies</h3>
	            <p>The TIB websites use cookies. Cookies are text files that are placed and stored on a computer system via an Internet browser and serve to render the offer of the TIB more user-friendly, effective and secure.<br/><br/>Most of the cookies used are so-called "session cookies", which are automatically deleted at the end of the visit. Other cookies remain stored on the userʼs terminal device until they delete them. These cookies enable the TIB to recognise the userʼs browser on their next visit.<br/><br/>Users can prevent and permanently object to the setting of cookies by TIB websites at any time by choosing the corresponding settings of the Internet browser used. Furthermore, cookies already set can be deleted at any time with the Internet browser or by other software programs. This is possible in all common Internet browsers. If the data subject deactivates the setting of cookies in the Internet browser used, the TIB web pages may not function properly.</p>
              <br/>
            <h3>Use of Web analysis tools</h3>
	            <p>For the creation of the web statistics we use the open source software Matomo (formerly PIWIK) in anonymized form. This means that no personal data is processed. The use of cookies in the web analysis software Matomo is deactivated.</p>
              <p>When saving the user IP address, the last two octets are not processed. The collection of the user ID is deactivated. For the analysis, the following data is collected in addition to the access to the site and the anonymized IP address: Date and time of the request, page title of the requested page, URL of the previously requested page (referrer URL), screen resolution of the client system, local time zone, URL of clicked and downloaded files, URL of clicked external domains, geolocation of the client (country, region, city), main language of the used browser, user agent of the used browser.</p>
              <p><b>Matomo-Opt-out</b></p>
              <iframe
                    style={{border: 0, height: 200, width: 600}}
                    src={"https://support.tib.eu/piwik/index.php?module=CoreAdminHome&action=optOut&language=en&backgroundColor=&fontColor=&fontSize=&fontFamily=sans-serif"}>
              </iframe>

            </div>
          </div>
            
      )
    }
}

export default PrivacyPolicy