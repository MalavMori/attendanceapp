import React from 'react'
import { Notification } from '@mantine/core'
const AlertLoading = () => {
  return (
    <Notification
        pos="fixed"
        loading
        withCloseButton={false}
        style={{
          right: 0,
          bottom: 0,
          margin: 20,
          zIndex:1000
        }}
        title="Please wait"
      >
        Waiting for Server Response
      </Notification>
  )
}

export default AlertLoading