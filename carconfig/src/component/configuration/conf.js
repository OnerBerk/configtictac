import React, {useState} from 'react'
import Color from "./color"
import Environment from './environment'
import IntExt from './intExt'
import View from './view'

import styles from "../../styles/conf.module.scss"
const Conf = (props) => {

    const [colorbtn, setColorBtn] = useState(false)
    const [environmentbtn, setEnvironmentBtn] = useState(false)
    const [intExtbtn, setIntExtBtn] = useState(false)
    const [viewbtn, setViewBtn] = useState(false)

    const setAllFalse = () => {
        setEnvironmentBtn(false);
        setIntExtBtn(false);
        setViewBtn(false);
        setColorBtn(false)
    }

    let app = props.appRef

    return (
        <div className={styles.conf}>
            
            <div className={styles.main}>
                <p onClick={() => {
                    setAllFalse();
                    setColorBtn(!colorbtn)
                }}> Color </p><br/>
                <p onClick={() => {
                    setAllFalse();
                    setEnvironmentBtn(!environmentbtn)
                }}> Environment </p>
                <p onClick={() => {
                    setAllFalse();
                    setIntExtBtn(!intExtbtn)
                }}> Int / Ext </p>
                <p onClick={() => {
                    setAllFalse();
                    setViewBtn(!viewbtn)
                }}> View </p>
            </div>
            <div className={styles.detail}>
                {colorbtn && <div className={styles.menuColor}>< Color appRef={app}/></div>}
                {environmentbtn && <div className={styles.menuEnvironment}>< Environment appRef={app}/></div>}
                {intExtbtn && <div className={styles.menuAccesory}>< IntExt appRef={app}/></div>}
                {viewbtn && <div className={styles.menuView}>< View appRef={app}/></div>}
            </div>

        </div>
    )
}
export default Conf