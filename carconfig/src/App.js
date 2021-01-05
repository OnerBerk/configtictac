import React from 'react'
import CanvasProject from './component/component3d/canvas';
import styles from "./styles/global.scss"

const App = () => {

  return (
      <div className={styles.app}>
        <CanvasProject/>
      </div>
  );
}
export default App;
