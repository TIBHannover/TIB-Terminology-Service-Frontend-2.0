import { EuiFlexGroup, EuiFlexItem, EuiText, EuiPanel } from '@elastic/eui'
import { EuiCustomLink } from '../../../layout/EuiCustomLink'
import React from 'react'

interface CrossRefProps {
  obo_xref?: Array<{
    database: string;
    id: string;
    url: string;
  }>;
}
const CrossReferencesTab = (props: CrossRefProps) => {
  return (
    <EuiPanel>
      <EuiFlexGroup style={{ padding: 7 }} direction="column">
        {props.obo_xref
          ? (
              props.obo_xref.map((item, index) => {
                return (
              <EuiFlexItem key={item.id + index}>
                {item.url
                  ? (
                  <EuiCustomLink to={item.url} external target="_blank">
                    {item.database}:{item.id}
                  </EuiCustomLink>
                    )
                  : (
                      item.database + ':' + item.id
                    )}
              </EuiFlexItem>
                )
              })
            )
          : (
          <EuiText>No cross references exit for this concept.</EuiText>
            )}
      </EuiFlexGroup>
    </EuiPanel>
  )
}

export default CrossReferencesTab
