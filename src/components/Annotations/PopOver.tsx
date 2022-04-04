import { EuiPopover } from '@elastic/eui'
import React, { ReactNode, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (props: React.PropsWithChildren<{ trigger: ReactNode }>) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  return (
    <EuiPopover
      onClick={() => setIsPopoverOpen(true)}
      // onMouseOver={() => setIsPopoverOpen(true)}
      // onMouseLeave={() => {
      //     setIsPopoverOpen(false);
      // }}
      style={{ cursor: 'pointer' }}
      closePopover={() => {
        setIsPopoverOpen(false)
      }}
      isOpen={isPopoverOpen}
      button={<>{props.trigger}</>}
      anchorPosition="downCenter"
    >
      <>
        {React.Children.map(props.children, (child) => {
          // checking isValidElement is the safe way and avoids a typescript error too
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { isPopoverOpen: isPopoverOpen })
          } else {
            return child
          }
        })}
      </>
    </EuiPopover>
  )
}
