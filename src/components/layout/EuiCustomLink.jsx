import React from 'react'
import { EuiLink, EuiHeaderLink } from '@elastic/eui'
import { useHistory } from 'react-router'

const isModifiedEvent = (event) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

const isLeftClickEvent = (event) => event.button === 0

const isTargetBlank = (event) => {
  const target = event.target.getAttribute('target')
  return target && target !== '_self'
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function EuiCustomLink ({ to, ...rest }) {
  // This is the key!
  const history = useHistory()

  function onClick (event) {
    if (event.defaultPrevented) {
      return
    }

    // Let the browser handle links that open new tabs/windows
    if (
      isModifiedEvent(event) ||
      !isLeftClickEvent(event) ||
      isTargetBlank(event)
    ) {
      return
    }

    // Prevent regular link behavior, which causes a browser refresh.
    event.preventDefault()

    // Push the route to the history.
    if (history) history.push(to)
  }

  // Generate the correct link href (with basename accounted for)
  if (history) {
    const href = history.createHref({ pathname: to })
    const props = { ...rest, href, onClick }
    return <EuiLink {...props} />
  } else {
    const props = { ...rest, href: to, onClick }
    return <EuiLink {...props} />
  }
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function EuiCustomHeaderLink ({ to, ...rest }) {
  // This is the key!
  const history = useHistory()

  function onClick (event) {
    if (event.defaultPrevented) {
      return
    }

    // Let the browser handle links that open new tabs/windows
    if (
      isModifiedEvent(event) ||
      !isLeftClickEvent(event) ||
      isTargetBlank(event)
    ) {
      return
    }

    // Prevent regular link behavior, which causes a browser refresh.
    event.preventDefault()

    // Push the route to the history.
    history.push(to)
  }

  // Generate the correct link href (with basename accounted for)
  const href = history.createHref({ pathname: to })

  const props = { ...rest, href, onClick }
  return <EuiHeaderLink {...props} />
}
