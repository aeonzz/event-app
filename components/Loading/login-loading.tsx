import React from 'react'

const LoginLoading = () => {
  return (
    <div className='h-screen flex-1 flex items-center justify-center'>
      <div className="pyramid-loader">
        <div className="wrapper">
          <span className="side side1"></span>
          <span className="side side2"></span>
          <span className="side side3"></span>
          <span className="side side4"></span>
          <span className="shadow"></span>
        </div>
      </div>
    </div>
  )
}

export default LoginLoading