import { AnnotationIF } from '../../api'
import SingleConceptInformationToolTip from './SingleConceptAdvanced/OverviewMetadataInformation'
import PopOver from './PopOver'
import React from 'react'

export interface ToolTipProps {
  className: string;
  annotations: Array<AnnotationIF & { covered_text: string }>;
}

/**
 * Highlights a single or multiple concepts.
 * @param props
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (props: React.PropsWithChildren<ToolTipProps>) => {
  return (
    <>
      {props.annotations.length === 1
        ? (
        <PopOver trigger={props.children}>
          {' '}
          <SingleConceptInformationToolTip
            annotations={props.annotations}
            className={props.className}
          />{' '}
        </PopOver>
          )
        : (
        <PopOver trigger={props.children}>
          <SingleConceptInformationToolTip
            annotations={props.annotations}
            className={props.className}
          />{' '}
        </PopOver>
          )}
    </>
  )
}
