import React from 'react'
import './OntologyDetail.css'
import OntologyInfoBox from './widgets/infoBox'
import OntologyStatsBox from './widgets/stats'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import ClassTree from '../ClassTree/ClassTree'
import PropertyTree from '../PropertyTree/PropertyTree'
import {getOntologyDetail} from '../../../api/nfdi4chemapi';

class OntologyDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      ontologyId: props.match.params.ontologyId,
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
      rootProps: []
    })
    this.tabChange = this.tabChange.bind(this)
  }



  /**
   * Get the ontology detail from the backend
   */
  async getOntology () {
    let theOntology = await getOntologyDetail(this.state.ontologyId);
    if (typeof theOntology != undefined){
      this.setState({
        isLoaded: true,
        ontology: theOntology
      });
    }
    else{
      this.setState({
        isLoaded: true,
        error
      });
    }

  }




  /**
     * Get the ontology root classes from the backend
     */
  getRootTerms () {
    const url = '/rootterms/' + this.state.ontologyId
    fetch((this.props.url ?? 'http://localhost:8080') + url, {
      method: 'GET', mode: 'cors'
    })
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isRootTermsLoaded: true,
            rootTerms: result
          })
        },
        (error) => {
          this.setState({
            isRootTermsLoaded: true,
            errorRootTerms: error
          })
        }
      )
  }

  /**
     * Get the ontology root properties from the backend
     */
  getRootProps () {
    const url = '/rootproperties/' + this.state.ontologyId
    fetch((this.props.url ?? 'http://localhost:8080') + url, {
      method: 'GET', mode: 'cors'
    })
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            rootProps: result
          })
        },
        // eslint-disable-next-line handle-callback-err
        (error) => {

        }
      )
  }

  /**
     * Handle the tab change in the ontology detail Top menu
     *
     * @param {*} e
     * @param {*} value
     */
  tabChange = (e, value) => {
    if (value === 0) { // overview
      this.setState({
        overViewTab: true,
        termsTab: false,
        propTab: false,
        activeTab: 0
      })
    } else if (value === 1) { // terms (classes)
      this.setState({
        overViewTab: false,
        termsTab: true,
        propTab: false,
        activeTab: 1
      })
    } else { // properties
      this.setState({
        overViewTab: false,
        termsTab: false,
        propTab: true,
        activeTab: 2
      })
    }
  }

  componentDidMount () {
    this.getOntology()
    this.getRootTerms()
    this.getRootProps()
  }

  render () {
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>
    } else if (!this.state.isLoaded) {
      return <div>Loading...</div>
    } else {
      return (
        <div>
          <Paper square>
            <Tabs
              value={this.state.activeTab}
              indicatorColor="primary"
              textColor="primary"
              onChange={this.tabChange}
              aria-label="disabled tabs example"
            >
              <Tab label="Overview" />
              <Tab label="Classes" />
              <Tab label="Properties"/>
              <Tab label="Mappings"/>
            </Tabs>
          </Paper>
          {this.state.overViewTab &&
                        <Grid container>
                          <Grid item xs={8}>
                            <OntologyInfoBox ontology={this.state.ontology} />
                          </Grid>
                          <Grid item xs={4}>
                            <OntologyStatsBox ontology={this.state.ontology} />
                          </Grid>
                        </Grid>
          }
          {this.state.termsTab &&
                        <ClassTree
                          rootTerms={this.state.rootTerms}
                        />
          }

          {this.state.propTab &&
                        <PropertyTree
                          rootProps={this.state.rootProps}
                        />
          }
        </div>

      )
    }
  }
}

export default OntologyDetail
