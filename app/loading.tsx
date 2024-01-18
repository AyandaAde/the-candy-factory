import React from 'react'

type Props = {}

const LoadingPage = (props: Props) => {
    return (
        <div className="w-full h-full relative">
            <span className="loading loading-dots loading-lg dark:text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
    )
}

export default LoadingPage