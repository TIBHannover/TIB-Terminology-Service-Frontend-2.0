import React from 'react'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import './TermPage.css'

class TermPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      label_xs: 2,
      value_xs: 10
    })
  }

  formatText (text, isLink = false) {
    if (text == null || text === '') {
      return 'null'
    } else if (isLink) {
      return (<a href={text} target='_blank' rel="noreferrer">{text}</a>)
    }
    return text
  }

  render () {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} spacing={4} className="term-page-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="term-detail-label">Label</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="term-detail-value">
              {this.formatText(this.props.term.label)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="term-page-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="term-detail-label">Short Form</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="term-detail-value">
              {this.formatText(this.props.term.short_form)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="term-page-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="term-detail-label">Description</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="term-detail-value">
              {this.formatText(this.props.term.description)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="term-page-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="term-detail-label">Definition</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="term-detail-value">
              {this.formatText(this.props.term.annotation.definition)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="term-page-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="term-detail-label">IRI</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="term-detail-value">
              {this.formatText(this.props.term.iri, true)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="term-page-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="term-detail-label">Ontology</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="term-detail-value">
              {this.formatText(this.props.term.ontology_name)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="term-page-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="term-detail-label">Example Usage</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="term-detail-value">
              {this.formatText(this.props.term.annotation.example_usage)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="term-page-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="term-detail-label">Editor Note</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="term-detail-value">
              {this.formatText(this.props.term.annotation.editor_note)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="term-page-row">
          <Grid container>
            <Grid item xs={this.state.label_xs}>
              <Typography className="term-detail-label">Is Defined By</Typography>
            </Grid>
            <Grid item xs={this.state.value_xs} className="term-detail-value">
              {this.formatText(this.props.term.annotation.isDefinedBy)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default TermPage
