import { ToolTipProps } from '../Annotation'
import {
  EuiBadge,
  EuiFlexGroup,
  EuiFlexItem,
  EuiTabbedContent,
  EuiTabbedContentTab,
  EuiText
} from '@elastic/eui'
import React from 'react'
import assert from 'assert'
import { useQuery } from 'react-query'
import { AnnotationIF } from '../../../api'
import { fetchConceptById } from '../../../api/nfdi4chemapi'
import AlternativeNameTab from './tabs/AlternativeName'
import HierarchyTab from './tabs/Hierarchy'
import CrossReferencesTab from './tabs/CrossReferences'
import { EuiCustomLink } from '../../layout/EuiCustomLink'

export default (props: React.PropsWithChildren<ToolTipProps>) => {
  assert(props.annotations.length === 1)

  const { data: annotation, isSuccess, isError, isLoading } = useQuery<
    | {
        conceptId: string;
        annotation: AnnotationIF;
        concept: {
          _links: {
            self: {
              href: string;
            };
          };
          iri: string;
          label: string;
          description?: string[];
          synonyms?: string[];
          obo_xref?: Array<{
            database: string;
            id: string;
            url: string;
          }>;
          obo_id: string;
          ontology_prefix?: string;
          short_form: string;
        };
      }
    | undefined
  >(
    ['concept-anno', props.annotations[0].concept],
    () => {
      return fetchConceptById(props.annotations[0].concept).then((rsp) => {
        return {
          conceptId: props.annotations[0].concept,
          annotation: props.annotations[0],
          concept: rsp.concept
        }
      })
    },
    {
      // The query will not execute until the tooltip is shown
      // @ts-ignore
      enabled: props.isPopoverOpen,
      staleTime: Infinity
    }
  )

  const tabs: Array<EuiTabbedContentTab> = [
    {
      content: <AlternativeNameTab synonyms={annotation?.concept?.synonyms} />,
      id: 'tab1',
      name: 'Alternative Names'
    },
    {
      content: (
        <HierarchyTab
          linkToSelf={annotation?.concept?._links.self?.href}
          iri={annotation?.concept?.iri}
        />
      ),
      id: 'tab2',
      name: 'Hierarchy'
    },
    {
      content: <CrossReferencesTab obo_xref={annotation?.concept?.obo_xref} />,
      id: 'tab3',
      name: 'Cross references'
    }
  ]

  return (
    <>
      {(isError || isLoading || !annotation?.concept) &&
        props.annotations[0].concept}
      {isSuccess && annotation && annotation?.concept && (
        <EuiFlexGroup direction="column" style={{ maxWidth: 600 }}>
          <EuiFlexItem grow={false}>
            <span>
              <EuiBadge color="primary">
                {annotation.concept?.ontology_prefix}
              </EuiBadge>
              {' > '}
              <EuiBadge color="secondary">
                {annotation.concept?.short_form}
              </EuiBadge>
            </span>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFlexGroup direction="column">
              <EuiFlexItem>
                <EuiFlexGroup>
                  <EuiFlexItem grow={false}>
                    {/* <EuiCustomLink to={annotation?.concept.iri} external> */}
                    <EuiText>
                      <b>{annotation.concept?.label}</b>
                    </EuiText>
                    {/* </EuiCustomLink> */}
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>

              <EuiFlexItem grow={false}>
                <EuiCustomLink
                  to={
                    'https://service.tib.eu/ts4tib/api/ontologies/' +
                    annotation?.concept?.ontology_prefix +
                    '/terms?iri=' +
                    encodeURIComponent(annotation?.concept.iri)
                  }
                  external
                  target="_blank"
                >
                  {annotation?.concept.iri}
                </EuiCustomLink>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiText>
              {annotation.concept?.description != null
                ? (
                <>{annotation.concept?.description}</>
                  )
                : (
                <>{''}</>
                  )}
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem>
            {/* <EuiPanel hasShadow={false} hasBorder={false}> */}
            <EuiTabbedContent size="s" tabs={tabs}></EuiTabbedContent>
            {/* </EuiPanel> */}
          </EuiFlexItem>
        </EuiFlexGroup>
      )}
    </>
  )
}
