import React, {useState} from 'react'
import {setFire} from "../../util/canvas-callback"
import styles from "../../styles/conf.module.scss"

const Color = (props) => {
    const [newColor, setNewColor] = useState("")
    let app = props.appRef

    setFire("color", newColor, app)

    return (
        <div className={styles.subMenu}>
            <p className={styles.colorRed} onClick={() => setNewColor("red")}> Red </p>
            <p className={styles.colorBlack} onClick={() => setNewColor("black")}> Black </p>
            <p className={styles.colorGreen} onClick={() => setNewColor("green")}> green </p>
            <p className={styles.colorBlue} onClick={() => setNewColor("blue")}> blue </p>
        </div>
    )
}

export default Color