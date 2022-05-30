import React from 'react';
import skeleton from './skeleton.module.scss'

const skeletonArray = Array.from({ length: 20 })

export const Skeleton = () => {
    return(
        <div className={skeleton.cardWrapper}>
            {skeletonArray
                .map((_, index) => {
                    return (
                        <div key={index} className={skeleton.cardContainer}>
                            <div className={skeleton.card}/>
                            <div className={skeleton.cardHeading}/>
                        </div>
                    )
                })
            }
        </div>
    )
}