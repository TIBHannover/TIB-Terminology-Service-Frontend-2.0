import { AnnotationIF } from '../../api'
import IntervalTree from '@live-change/interval-tree'
import Annotation from './Annotation'

interface AnnotationProps {
  annotations: Array<AnnotationIF>
  text: string
  textId?: string
}

/**
 * Highlights given Annotation in given text string.
 *
 * In order to highlight an annotation, the matched string is encodes in a Annotation (span). The span has the annotation class as
 * css class attached. If there are multiple annotations with the same begin and end offset, multiple css classes are
 * added. If annotations are partly overlapping, a span (min begin offset til max end offset) is added with the
 * unified set of annotation class as css classes. Precise behavior of the Annotation is defined within Annotation.tsx
 * and css classes are manged by AnnotationSelector.tsx
 *
 * @param props
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (props: AnnotationProps) => {
  const tree = new IntervalTree()

  props.annotations.forEach((value) => {
    tree.insert([value.offset.start, value.offset.end], value)
  })

  const prefix = (str: string, from: number, bis: number) => {
    return str.substring(from, bis)
  }

  const infix = (str: string, start: number, end: number) => {
    return str.substring(start, end)
  }

  const sufix = (str: string, start: number) => {
    return str.substr(start)
  }

  const get_span_annotation = (str: string, tree: IntervalTree) => {
    let res = <></>
    let start = 0
    let end = 0
    const processed = new IntervalTree()
    // @TODO: Fix that!
    // eslint-disable-next-line array-callback-return
    tree.map((value, key) => {
      if (key) {
        if (processed.search(key).length) {
          return {}
        }
      }
      const content: Array<AnnotationIF & {covered_text:string}> = []
      const classNames: Array<string> = ['annotation']
      let _infix = ''
      if (key) {
        // @TODO: Fix that!
        // eslint-disable-next-line array-callback-return
        tree.search(key).map((value) => {
          processed.insert(key)
          value.covered_text = infix(str, value.offset.start, value.offset.end)
          content.push(value)
          classNames.push(value.class)
          _infix = infix(
            str,
            Math.min(key.low, value.offset.start),
            Math.max(key.high, value.offset.end)
          )
          end = Math.max(key.high, value.offset.end)
        })
      }
      const _pre = prefix(str, start, value.offset.start)

      res = (
        <>
          {res}
          {_pre}
          <Annotation
            className={classNames.join(' ')}
            annotations={content}
          ><span className={classNames.join(' ')}>{_infix}</span></Annotation>
        </>
      )
      start = value.offset.end
    })

    res = (
      <>
        {res}
        {sufix(str, end)}
      </>
    )

    return res
  }

  return <p style={{ textAlign: 'justify' }}>{get_span_annotation(props.text, tree)} </p>
}
