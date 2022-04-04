import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from '@elastic/eui'

interface AlternativeNameTabProps {
  synonyms?: Array<string>;
}

const AlternativeNameTab = (props: AlternativeNameTabProps) => {
  return (
    <EuiPanel>
      <EuiFlexGroup style={{ padding: 10 }} direction="column">
        {props.synonyms
          ? (
              props.synonyms.map((value, index) => {
                return <EuiFlexItem key={value + index}>{value}</EuiFlexItem>
              })
            )
          : (
          <EuiText>No alternative names exit for this concept.</EuiText>
            )}
      </EuiFlexGroup>
    </EuiPanel>
  )
}

export default AlternativeNameTab
