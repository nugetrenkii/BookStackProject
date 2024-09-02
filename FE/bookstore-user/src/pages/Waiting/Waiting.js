// import React from 'react'
// import { LoadingOutlined } from '@ant-design/icons';
// import "./Waiting.css"
// function Waiting() {
//   return (
//     <div className="loading-overlay">
//       <LoadingOutlined  className="loading-icon" />
//     </div>
//   )
// }

// export default Waiting


import React from 'react'
import './Waiting.css';
import { LoadingOutlined } from '@ant-design/icons';
function Waiting() {
  return (
    <div className="loading-overlay">
      <LoadingOutlined className="loading-icon" />
    </div>
  )
}

export default Waiting