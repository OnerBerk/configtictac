import React, {useEffect, useRef, useState} from 'react'
import LoadModules from "./__modules__"
import Conf from "../configuration/conf"
import config from "./setting"
import {createInputDevices, displayError, reflow} from "./playcanvas-builder"

import styles from "../../styles/canvas.module.scss"

const CanvasProject = () => {

    let [app, setApp] = useState()
    const pc = window.pc
    const canvasRef = useRef(null)


    useEffect(() => {
        start()
    }, []);

    const start = () => {
        let devices, canvas
        canvas = canvasRef.current
        devices = createInputDevices(canvas);
        displayError();

        try {
            app = new pc.Application(canvas,
                {
                    elementInput: devices.elementInput,
                    keyboard: devices.keyboard,
                    mouse: devices.mouse,
                    gamepads: devices.gamepads,
                    touch: devices.touch,
                    graphicsDeviceOptions: config.CONTEXT_OPTIONS,
                    assetPrefix: config.ASSET_PREFIX || "",
                    scriptPrefix: config.SCRIPT_PREFIX || "",
                    scriptsOrder: config.SCRIPTS || []
                });
        } catch (e) {
            if (e instanceof pc.UnsupportedBrowserError) {
                displayError('This page requires a browser that supports WebGL.<br/>' +
                    '<a href="http://get.webgl.org">Click here to find out more.</a>');
            } else if (e instanceof pc.ContextCreationError) {
                displayError("It doesn't appear your computer can support WebGL.<br/>" +
                    '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>');
            } else {
                displayError('Could not initialize application. Error: ' + e);
            }
            return;
        }

        let configure = function () {
            app.configure("modele/config.json", function (err) {
                if (err) {
                    console.error(err)
                }
                setTimeout(function () {
                    reflow(app, canvas)
                    app.preload(function (err) {
                        if (err) {
                            console.error(err)
                        }
                        app.loadScene("modele/953348.json", function (err) {
                            if (err) {
                                console.error(err)
                            }
                            app.start();
                        });
                    })
                })
            });
        }
        LoadModules(config.PRELOAD_MODULES, config.ASSET_PREFIX, configure);
        setApp(app)
    };


    return (
        <div className={styles.can}>
            <Conf appRef={app}/>
            <canvas id="ls-modele-1" ref={canvasRef}/>
        </div>
    )
}
export default CanvasProject