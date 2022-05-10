import { EuiButton, EuiCheckbox } from '@elastic/eui'
import { css, Global } from '@emotion/react'
import chroma from 'chroma-js'
import React, { Fragment, useState } from 'react'
import { Facet } from '../../api'
import { useQueries } from 'react-query'
import { getClassName } from '../../api/fetchData'

interface AnnotationsProps {
  annotations: Facet;
}

function hashCode (str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + (hash << 5)
  }
  return hash
}

function intToRGB (i: number) {
  const c = (i & 0xffffff).toString(16).toUpperCase()
  return '000000'.substring(0, 6 - c.length) + c
}

/**
 * Component to enable the highlight of certain annotation classes.
 *
 *
 * @param props
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (props: AnnotationsProps) => {
  /* const colors = chroma
    .scale(["yellow", "red", "green"])
    .colors(props.annotations.data.length); */

  const [annotations, setAnnotations] = useState<
    Array<{ id: string; checked: boolean; color: string }>
  >(
    props.annotations.data.map((s) => {
      return {
        id: s.key,
        checked: true,
        color: '#' + intToRGB(hashCode(s.key))
      }
    })
  )
  const [select_all, setselect_all] = useState(true)

  const userQueries = useQueries(
    props.annotations.data
      .map((s) => {
        return { classID: s.key.replace(props.annotations.prefix + ':', '') }
      })
      .map((d) => {
        return {
          queryKey: ['class', d.classID],
          queryFn: () => {
            return getClassName(d.classID).then((rsp) => {
              return { classID: d.classID, prefLabel: rsp.prefLabel }
            })
          },
          staleTime: Infinity
        }
      })
  )

  const getPrefName = (id: string) => {
    const a = userQueries
      .filter((s) => s.isSuccess)
      // @ts-ignore
      .find((s) => s?.data?.classID === id)
    // @ts-ignore
    return a?.data?.prefLabel ? a?.data?.prefLabel : undefined
  }

  return (
    <Fragment>
      <Global
        styles={css`
          .annotation {
            text-decoration-line: underline;
            text-decoration-style: dotted;
            border-radius: 0.35em;
            padding: 0.1em 0.2em;
            margin: 0.2em;
          }
        `}
      />

      <>
        {annotations.map((e) => {
          return (
            <Fragment key={e.id}>
              {e.checked && (
                <Global
                  key={'style-' + e.id}
                  styles={css`
                    .${e.id} {
                      background-color: rgba(
                        ${chroma(e.color).rgb()[0]},
                        ${chroma(e.color).rgb()[1]},
                        ${chroma(e.color).rgb()[2]},
                        0.5
                      );
                    }
                  `}
                />
              )}
              <EuiCheckbox
    key={'box-' + e.id}
    checked={e.checked}
    id={e.id}
    onChange={(id) => {
      setAnnotations(
        annotations.map((item) => {
          if (item.id === id.target.id) {
            item.checked = !item.checked
          }
          return item
        })
      )
    }}
    label={
        <span
            className={'annotation'}
            style={{
              backgroundColor: `rgba(${chroma(e.color).rgb()[0]}, ${
                    chroma(e.color).rgb()[1]
                },${chroma(e.color).rgb()[2]}, 0.5`
            }}
        >
                    {getPrefName(e.id) ? getPrefName(e.id) : e.id}
                  </span>
    }
    />
            </Fragment>
          )
        })}
      </>
      <EuiButton
        style={{ width: '100px' }}
        onClick={() => {
          setAnnotations(
            annotations.map((item) => {
              item.checked = !select_all
              return item
            })
          )
          setselect_all(!select_all)
        }}
      >
        {(select_all ? 'deselect' : 'select') + ' all'}
      </EuiButton>
    </Fragment>
  )
}
