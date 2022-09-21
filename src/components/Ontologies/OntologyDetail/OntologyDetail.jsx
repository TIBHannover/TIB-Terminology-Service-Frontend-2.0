import React from 'react'
import OntologyInfoBox from './widgets/infoBox'
import OntologyStatsBox from './widgets/stats';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import DataTree from '../DataTree/DataTree';
import { Link } from 'react-router-dom';
import queryString from 'query-string'; 
import {getOntologyDetail, getOntologyRootTerms, getOntologyRootProperties} from '../../../api/fetchData';




class OntologyDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      ontologyId: "",
      lastRequestedTab: "",
      ontology: null,
      error: null,
      isLoaded: false,
      isRootTermsLoaded: false,
      errorRootTerms: null,
      overViewTab: true,
      termsTab: false,
      propTab: false,
      activeTab: 0,
      rootTerms: [],
      rootProps: [],
      waiting: false,
      targetTermIri: " ",
      targetPropertyIri: " ",
      rootNodeNotExist: false
    })
    this.tabChange = this.tabChange.bind(this);
    this.setTabOnLoad = this.setTabOnLoad.bind(this);
    this.setOntologyData = this.setOntologyData.bind(this);
  }


  /**
   * Set ontology related data
   */
  setOntologyData (){
    let ontologyId = this.props.match.params.ontologyId;
    if(this.state.ontologyId != ontologyId){
      this.getOntology(ontologyId);
      this.getRootTerms(ontologyId);
      this.getRootProps(ontologyId);
      this.setState({
        ontologyId: ontologyId
      });
    }    
  }



  /**
   * Set the active tab and its page on load
   */
  setTabOnLoad(){
    let requestedTab = this.props.match.params.tab;
    let targetQueryParams = queryString.parse(this.props.location.search + this.props.location.hash);
    let lastRequestedTab = this.state.lastRequestedTab;
    if (requestedTab != lastRequestedTab && requestedTab == 'terms'){
      this.setState({
        overViewTab: false,
        termsTab: true,
        propTab: false,
        activeTab: 1,
        waiting: false,
        lastRequestedTab: requestedTab,
        targetTermIri: targetQueryParams.iri
      });
    }
    else if (requestedTab != lastRequestedTab && requestedTab == 'props'){
      this.setState({
        overViewTab: false,
        termsTab: false,
        propTab: true,
        activeTab: 2,
        waiting: false,
        lastRequestedTab: requestedTab,
        targetPropertyIri: targetQueryParams.iri

      });
    }
    else if (requestedTab != lastRequestedTab){
      this.setState({
        overViewTab: true,
        termsTab: false,
        propTab: false,
        activeTab: 0,
        waiting: false,
        lastRequestedTab: requestedTab

      });
    }
  }



  /**
   * Get the ontology detail from the backend
   */
  async getOntology (ontologyId) {
    let theOntology = await getOntologyDetail(ontologyId);
    if (typeof theOntology != undefined){
      this.setState({
        isLoaded: true,
        ontology: theOntology
      });
    }
    else{
      this.setState({
        isLoaded: true,
        error: 'Can not get this ontology'
      });
    }

  }


  /**
     * Get the ontology root classes 
     */
  async getRootTerms (ontologyId) {
    let rootTerms = await getOntologyRootTerms(ontologyId);
    if (typeof(rootTerms) != undefined){
      if (rootTerms.length !== 0){
        this.setState({
          isRootTermsLoaded: true,
          rootTerms: rootTerms,
          rootNodeNotExist: false
        });
      }
      else{
        this.setState({
          isRootTermsLoaded: true,
          rootTerms: rootTerms,
          rootNodeNotExist: true
        });
      }      
    }
    else{
      this.setState({
        isRootTermsLoaded: true,
        errorRootTerms: 'Can not get this ontology root terms',
        rootNodeNotExist: true
      });
    }
  }



  /**
     * Get the ontology root properties from the backend
     */
  async getRootProps (ontologyId) {
    let rootProps = await getOntologyRootProperties(ontologyId);
    if (typeof rootProps != undefined){
      if(rootProps.length !== 0){
        this.setState({
          rootProps: rootProps,
          rootNodeNotExist: false
        });
      }
      else{
        this.setState({
          rootProps: rootProps,
          rootNodeNotExist: true
        });
      }
    }
   
  }


  /**
     * Handle the tab change in the ontology detail Top menu
     *
     * @param {*} e
     * @param {*} value
     */
  tabChange = (e, value) => {
    this.setState({
      waiting: true
    });
    if (value === 0) { // overview
      this.setState({
        overViewTab: true,
        termsTab: false,
        propTab: false,
        activeTab: 0,
        waiting: false
      })
    } else if (value === 1) { // terms (classes)
      this.setState({
        overViewTab: false,
        termsTab: true,
        propTab: false,
        activeTab: 1,
        waiting: false
      })
    } else { // properties
      this.setState({
        overViewTab: false,
        termsTab: false,
        propTab: true,
        activeTab: 2,
        waiting: false
      })
    }
  }


  componentDidMount () {
    this.setOntologyData();
    this.setTabOnLoad();
  }

  componentDidUpdate(){
    this.setOntologyData();
    this.setTabOnLoad();
  }



  render () {
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>
    } else if (!this.state.isLoaded) {
      return <div>Loading...</div>
    } else {
      return (
        <div className='row justify-content-center'>
          <div className='col-sm-8'>
              <Tabs
                value={this.state.activeTab}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.tabChange}
                aria-label="disabled tabs example"
              >
                <Tab label="Overview"  to={"/ontologies/" + this.state.ontologyId}  component={Link} />
                <Tab label="Classes" to={"/ontologies/" + this.state.ontologyId + "/terms"} component={Link} />
                <Tab label="Properties"  to={"/ontologies/" + this.state.ontologyId + "/props"} component={Link} />
              </Tabs>          
              {!this.state.waiting && this.state.overViewTab &&
                            <Grid container key={'ontolofyOverviewPage'} className="ontology-detail-page-container"  spacing={4}>
                              <Grid item xs={9}>
                                <OntologyInfoBox ontology={this.state.ontology} />
                              </Grid>
                              <Grid item xs={3}>
                                <OntologyStatsBox ontology={this.state.ontology} />
                              </Grid>
                            </Grid>
              }
              {!this.state.waiting && this.state.termsTab &&
                            <DataTree
                              rootNodes={this.state.rootTerms}
                              componentIdentity={'term'}
                              iri={this.state.targetTermIri}
                              key={'termTreePage'}                    
                              ontology={this.state.ontologyId}
                              rootNodeNotExist={this.state.rootNodeNotExist}
                            />
              }

              {!this.state.waiting && this.state.propTab &&
                            <DataTree
                              rootNodes={this.state.rootProps}
                              componentIdentity={'property'}
                              iri={this.state.targetPropertyIri}
                              key={'propertyTreePage'}
                              ontology={this.state.ontologyId}
                              rootNodeNotExist={this.state.rootNodeNotExist}
                            />
              }
              {this.state.waiting && <CircularProgress />}
          </div>                    
        </div>

      )
    }
  }
}


export default OntologyDetail
