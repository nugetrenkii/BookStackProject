import React from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import "./Loading.css"
function Loading() {
  return (
    <div className="loading-overlay">
        {/* <LoadingOutlined /> */}
      <LoadingOutlined  className="loading-icon" />
    </div>
  )
}

export default Loading