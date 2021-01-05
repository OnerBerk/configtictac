import React, {useState} from 'react'
import {setFire} from "../../util/canvas-callback"


import styles from "../../styles/conf.module.scss"

const View = (props) => {
    const [newView, setNewView] = useState(1)
    let app = props.appRef

    setFire("camera", newView, app)

    return (
        <div className={styles.subMenu}>
            <p className={styles.colorRed} onClick={() => setNewView(1)}> view 1 </p>
            <p className={styles.colorBlack} onClick={() => setNewView(2)}> View 2 </p>
            <p className={styles.colorBlack} onClick={() => setNewView(3)}> View 3 </p>

        </div>
    )
}

export default View