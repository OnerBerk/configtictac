var TouchInput = pc.createScript("touchInput");

TouchInput.attributes.add("orbitSensitivity", {
    type: "number",
    default: .4,
    title: "Orbit Sensitivity",
    description: "How fast the camera moves around the orbit. Higher is faster"
}), TouchInput.attributes.add("distanceSensitivity", {
    type: "number",
    default: .2,
    title: "Distance Sensitivity",
    description: "How fast the camera moves in and out. Higher is faster"
}), TouchInput.prototype.initialize = function () {
    this.orbitCamera = this.entity.script.orbitCamera, this.lastTouchPoint = new pc.Vec2, this.lastPinchMidPoint = new pc.Vec2, this.lastPinchDistance = 0, this.orbitCamera && this.app.touch && (this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStartEndCancel, this), this.app.touch.on(pc.EVENT_TOUCHEND, this.onTouchStartEndCancel, this), this.app.touch.on(pc.EVENT_TOUCHCANCEL, this.onTouchStartEndCancel, this), this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this), this.on("destroy", function () {
        this.app.touch.off(pc.EVENT_TOUCHSTART, this.onTouchStartEndCancel, this), this.app.touch.off(pc.EVENT_TOUCHEND, this.onTouchStartEndCancel, this), this.app.touch.off(pc.EVENT_TOUCHCANCEL, this.onTouchStartEndCancel, this), this.app.touch.off(pc.EVENT_TOUCHMOVE, this.onTouchMove, this)
    }))
}, TouchInput.prototype.getPinchDistance = function (t, i) {
    var o = t.x - i.x, n = t.y - i.y;
    return Math.sqrt(o * o + n * n)
}, TouchInput.prototype.calcMidPoint = function (t, i, o) {
    o.set(i.x - t.x, i.y - t.y), o.scale(.5), o.x += t.x, o.y += t.y
}, TouchInput.prototype.onTouchStartEndCancel = function (t) {
    var i = t.touches;
    1 == i.length ? this.lastTouchPoint.set(i[0].x, i[0].y) : 2 == i.length && (this.lastPinchDistance = this.getPinchDistance(i[0], i[1]), this.calcMidPoint(i[0], i[1], this.lastPinchMidPoint))
}, TouchInput.fromWorldPoint = new pc.Vec3, TouchInput.toWorldPoint = new pc.Vec3, TouchInput.worldDiff = new pc.Vec3, TouchInput.prototype.pan = function (t) {
    var i = TouchInput.fromWorldPoint, o = TouchInput.toWorldPoint, n = TouchInput.worldDiff, h = this.entity.camera,
        c = this.orbitCamera.distance;
    h.screenToWorld(t.x, t.y, c, i), h.screenToWorld(this.lastPinchMidPoint.x, this.lastPinchMidPoint.y, c, o), n.sub2(o, i), this.orbitCamera.pivotPoint.add(n)
}, TouchInput.pinchMidPoint = new pc.Vec2, TouchInput.prototype.onTouchMove = function (t) {
    if (!0 === this.entity.enabled) {
        var i = TouchInput.pinchMidPoint, o = t.touches;
        if (1 == o.length) {
            var n = o[0];
            this.orbitCamera.pitch -= (n.y - this.lastTouchPoint.y) * this.orbitSensitivity, this.orbitCamera.yaw -= (n.x - this.lastTouchPoint.x) * this.orbitSensitivity, this.lastTouchPoint.set(n.x, n.y)
        } else if (2 == o.length) {
            var h = this.getPinchDistance(o[0], o[1]), c = h - this.lastPinchDistance;
            this.lastPinchDistance = h, this.orbitCamera.distance -= c * this.distanceSensitivity * .1 * (.1 * this.orbitCamera.distance), this.calcMidPoint(o[0], o[1], i), this.lastPinchMidPoint.copy(i)
        }
    }
};
var OrbitCamera = pc.createScript("orbitCamera");
OrbitCamera.attributes.add("distanceMax", {
    type: "number",
    default: 0,
    title: "Distance Max",
    description: "Setting this at 0 will give an infinite distance limit"
}), OrbitCamera.attributes.add("distanceMin", {
    type: "number",
    default: 0,
    title: "Distance Min"
}), OrbitCamera.attributes.add("pitchAngleMax", {
    type: "number",
    default: 90,
    title: "Pitch Angle Max (degrees)"
}), OrbitCamera.attributes.add("pitchAngleMin", {
    type: "number",
    default: -90,
    title: "Pitch Angle Min (degrees)"
}), OrbitCamera.attributes.add("clampValues", {
    type: "boolean",
    default: !0,
    title: "Use clamped values ",
    description: 'Do we use above values for clamping ?"'
}), OrbitCamera.attributes.add("inertiaFactor", {
    type: "number",
    default: 0,
    title: "Inertia Factor",
    description: "Higher value means that the camera will continue moving after the user has stopped dragging. 0 is fully responsive."
}), OrbitCamera.attributes.add("focusEntity", {
    type: "entity",
    title: "Focus Entity",
    description: "Entity for the camera to focus on. If blank, then the camera will use the whole scene"
}), OrbitCamera.attributes.add("frameOnStart", {
    type: "boolean",
    default: !0,
    title: "Frame on Start",
    description: 'Frames the entity or scene at the start of the application."'
}), OrbitCamera.attributes.add("epsilon", {
    type: "number",
    default: .01,
    title: "End of motion Epsilon threshold",
    description: "Threshold to detect end of motion when inertia is used."
}), Object.defineProperty(OrbitCamera.prototype, "FOV", {
    get: function () {
        return this._targetDistance
    }, set: function (t) {
        this._targetDistance = this._clampDistance(t)
    }
}), Object.defineProperty(OrbitCamera.prototype, "distance", {
    get: function () {
        return this._targetDistance
    }, set: function (t) {
        this._targetDistance = this._clampDistance(t)
    }
}), Object.defineProperty(OrbitCamera.prototype, "pitch", {
    get: function () {
        return this._targetPitch
    }, set: function (t) {
        this._targetPitch = this._clampPitchAngle(t)
    }
}), Object.defineProperty(OrbitCamera.prototype, "yaw", {
    get: function () {
        return this._targetYaw
    }, set: function (t) {
        this._targetYaw = t;
        var i = (this._targetYaw - this._yaw) % 360;
        this._targetYaw = i > 180 ? this._yaw - (360 - i) : i < -180 ? this._yaw + (360 + i) : this._yaw + i
    }
}), Object.defineProperty(OrbitCamera.prototype, "pivotPoint", {
    get: function () {
        return this._pivotPoint
    }, set: function (t) {
        this._pivotPoint.copy(t)
    }
}), OrbitCamera.prototype.focus = function (t) {
    this._buildAabb(t, 0);
    var i = this._modelsAabb.halfExtents, e = Math.max(i.x, Math.max(i.y, i.z));
    e /= Math.tan(.5 * this.entity.camera.fov * pc.math.DEG_TO_RAD), e *= 2, this.distance = e, this._removeInertia(), this._pivotPoint.copy(this._modelsAabb.center)
}, OrbitCamera.distanceBetween = new pc.Vec3, OrbitCamera.prototype.resetAndLookAtPoint = function (t, i) {
    this.pivotPoint.copy(i), this.entity.setPosition(t), this.entity.lookAt(i);
    var e = OrbitCamera.distanceBetween;
    e.sub2(i, t), this.distance = e.length(), this.pivotPoint.copy(i);
    var a = this.entity.getRotation();
    this.yaw = this._calcYaw(a), this.pitch = this._calcPitch(a, this.yaw), this._removeInertia(), this._updatePosition()
}, OrbitCamera.prototype.resetAndLookAtEntity = function (t, i) {
    this._buildAabb(i, 0), this.resetAndLookAtPoint(t, this._modelsAabb.center)
}, OrbitCamera.prototype.reset = function (t, i, e) {
    this.pitch = i, this.yaw = t, this.distance = e, this._removeInertia()
}, OrbitCamera.prototype.initialize = function () {
    var t = this, i = function () {
        t._checkAspectRatio()
    };
    window.addEventListener("resize", i, !1), this._checkAspectRatio(), this._modelsAabb = new pc.BoundingBox, this._buildAabb(this.focusEntity || this.app.root, 0), this.entity.lookAt(this._modelsAabb.center), this._pivotPoint = new pc.Vec3, this._pivotPoint.copy(this._modelsAabb.center);
    var e = this.entity.getRotation();
    if (this.mouseIsUp = !1, this._yaw = this._calcYaw(e), this._pitch = this._clampPitchAngle(this._calcPitch(e, this._yaw)), this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0), this._distance = 0, this._targetYaw = this._yaw, this._targetPitch = this._pitch, this.frameOnStart) this.focus(this.focusEntity || this.app.root); else {
        var a = new pc.Vec3;
        a.sub2(this.entity.getPosition(), this._pivotPoint), this._distance = this._clampDistance(a.length())
    }
    this._targetDistance = this._distance, this.on("attr:distanceMin", function (t, i) {
        this._targetDistance = this._clampDistance(this._distance)
    }), this.on("attr:distanceMax", function (t, i) {
        this._targetDistance = this._clampDistance(this._distance)
    }), this.on("attr:pitchAngleMin", function (t, i) {
        this._targetPitch = this._clampPitchAngle(this._pitch)
    }), this.on("attr:pitchAngleMax", function (t, i) {
        this._targetPitch = this._clampPitchAngle(this._pitch)
    }), this.on("attr:focusEntity", function (t, i) {
        this.frameOnStart ? this.focus(t || this.app.root) : this.resetAndLookAtEntity(this.entity.getPosition(), t || this.app.root)
    }), this.on("attr:frameOnStart", function (t, i) {
        t && this.focus(this.focusEntity || this.app.root)
    }), this.on("destroy", function () {
        window.removeEventListener("resize", i, !1)
    }), this.app.on("orbit:askForNewImage", function () {
        t.askForNewImage()
    })
}, OrbitCamera.prototype.update = function (t) {
    var i = 0 === this.inertiaFactor ? 1 : Math.min(t / this.inertiaFactor, 1);
    this._distance = pc.math.lerp(this._distance, this._targetDistance, i), this._yaw = pc.math.lerp(this._yaw, this._targetYaw, i), this._pitch = pc.math.lerp(this._pitch, this._targetPitch, i), this._updatePosition(), this._checkEndOfMotion()
}, OrbitCamera.prototype._updatePosition = function () {
    this.entity.setLocalPosition(0, 0, 0), this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0);
    var t = this.entity.getPosition();
    t.copy(this.entity.forward), t.scale(-this._distance), t.add(this.pivotPoint), this.entity.setPosition(t)
}, OrbitCamera.prototype._checkEndOfMotion = function () {
    var t = Math.abs(this._yaw - this._targetYaw), i = Math.abs(this._pitch - this._targetPitch),
        e = Math.abs(this._distance - this._targetDistance);
    t < this.epsilon && i < this.epsilon && e < this.epsilon && !0 === this.isInMotion && (this.isInMotion = !1, !0 === this.mouseIsUp && this.askForNewImage())
}, OrbitCamera.prototype.askForNewImage = function () {
    this.app.fire("ondemand:updateCamera", this.pitch, this.yaw, this.distance, this.entity.camera.fov)
}, OrbitCamera.prototype._removeInertia = function () {
    this._yaw = this._targetYaw, this._pitch = this._targetPitch, this._distance = this._targetDistance
}, OrbitCamera.prototype._checkAspectRatio = function () {
    var t = this.app.graphicsDevice.height, i = this.app.graphicsDevice.width;
    this.entity.camera.horizontalFov = t > i
}, OrbitCamera.prototype._buildAabb = function (t, i) {
    var e = 0;
    if (t.model) {
        var a = t.model.meshInstances;
        for (e = 0; e < a.length; e++) 0 === i ? this._modelsAabb.copy(a[e].aabb) : this._modelsAabb.add(a[e].aabb), i += 1
    }
    for (e = 0; e < t.children.length; ++e) i += this._buildAabb(t.children[e], i);
    return i
}, OrbitCamera.prototype._calcYaw = function (t) {
    var i = new pc.Vec3;
    return t.transformVector(pc.Vec3.FORWARD, i), Math.atan2(-i.x, -i.z) * pc.math.RAD_TO_DEG
}, OrbitCamera.prototype._clampDistance = function (t) {
    return !0 === this.clampValues ? this.distanceMax > 0 ? pc.math.clamp(t, this.distanceMin, this.distanceMax) : Math.max(t, this.distanceMin) : t
}, OrbitCamera.prototype._clampPitchAngle = function (t) {
    return !0 === this.clampValues ? pc.math.clamp(t, -this.pitchAngleMax, -this.pitchAngleMin) : t
}, OrbitCamera.quatWithoutYaw = new pc.Quat, OrbitCamera.yawOffset = new pc.Quat, OrbitCamera.prototype._calcPitch = function (t, i) {
    var e = OrbitCamera.quatWithoutYaw, a = OrbitCamera.yawOffset;
    a.setFromEulerAngles(0, -i, 0), e.mul2(a, t);
    var s = new pc.Vec3;
    return e.transformVector(pc.Vec3.FORWARD, s), Math.atan2(s.y, -s.z) * pc.math.RAD_TO_DEG
};
var MouseInput = pc.createScript("mouseInput");
MouseInput.attributes.add("orbitSensitivity", {
    type: "number",
    default: .3,
    title: "Orbit Sensitivity",
    description: "How fast the camera moves around the orbit. Higher is faster"
}), MouseInput.attributes.add("distanceSensitivity", {
    type: "number",
    default: .15,
    title: "Distance Sensitivity",
    description: "How fast the camera moves in and out. Higher is faster"
}), MouseInput.prototype.initialize = function () {
    if (this.orbitCamera = this.entity.script.orbitCamera, this.orbitCamera) {
        var t = this, o = function (o) {
            t.onMouseOut(o)
        };
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this), this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this), this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this), this.app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this), window.addEventListener("mouseout", o, !1), this.on("destroy", function () {
            this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this), this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this), this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this), this.app.mouse.off(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this), window.removeEventListener("mouseout", o, !1)
        })
    }
    this.app.mouse.disableContextMenu(), this.lookButtonDown = !1, this.panButtonDown = !1, this.lastPoint = new pc.Vec2
}, MouseInput.fromWorldPoint = new pc.Vec3, MouseInput.toWorldPoint = new pc.Vec3, MouseInput.worldDiff = new pc.Vec3, MouseInput.prototype.pan = function (t) {
    var o = MouseInput.fromWorldPoint, i = MouseInput.toWorldPoint, e = MouseInput.worldDiff, s = this.entity.camera,
        n = this.orbitCamera.distance;
    s.screenToWorld(t.x, t.y, n, o), s.screenToWorld(this.lastPoint.x, this.lastPoint.y, n, i), e.sub2(i, o), this.orbitCamera.pivotPoint.add(e)
}, MouseInput.prototype.onMouseDown = function (t) {
    if (!0 === this.entity.enabled) switch (this.orbitCamera.mouseIsUp = !1, t.button) {
        case pc.MOUSEBUTTON_LEFT:
            this.lookButtonDown = !0;
            break;
        case pc.MOUSEBUTTON_RIGHT:
            this.rightButtonDown = !0
    }
}, MouseInput.prototype.onMouseUp = function (t) {
    if (!0 === this.entity.enabled) switch (this.orbitCamera.mouseIsUp = !0, !1 === this.orbitCamera.isInMotion && this.orbitCamera.askForNewImage(), t.button) {
        case pc.MOUSEBUTTON_LEFT:
            this.lookButtonDown = !1;
            break;
        case pc.MOUSEBUTTON_MIDDLE:
        case pc.MOUSEBUTTON_RIGHT:
            this.panButtonDown = !1, this.rightButtonDown = !1
    }
}, MouseInput.prototype.onMouseMove = function (t) {
    if (!0 === this.entity.enabled) {
        pc.app.mouse;
        this.lookButtonDown ? (this.orbitCamera.pitch -= t.dy * this.orbitSensitivity, this.orbitCamera.yaw -= t.dx * this.orbitSensitivity, !1 === this.orbitCamera.isInMotion && this.app.fire("orbit:startmoving"), this.orbitCamera.isInMotion = !0) : this.rightButtonDown && (this.orbitCamera.distance -= t.dy * this.distanceSensitivity * (.1 * this.orbitCamera.distance), !1 === this.orbitCamera.isInMotion && this.app.fire("orbit:startmoving"), this.orbitCamera.isInMotion = !0, t.event.preventDefault()), this.lastPoint.set(t.x, t.y)
    }
}, MouseInput.prototype.onMouseWheel = function (t) {
}, MouseInput.prototype.onMouseOut = function (t) {
    this.lookButtonDown = !1, this.panButtonDown = !1, this.rightButtonDown = !1
};
var KeyboardInput = pc.createScript("keyboardInput");
KeyboardInput.prototype.initialize = function () {
    this.orbitCamera = this.entity.script.orbitCamera
}, KeyboardInput.prototype.postInitialize = function () {
    this.orbitCamera && (this.startDistance = this.orbitCamera.distance, this.startYaw = this.orbitCamera.yaw, this.startPitch = this.orbitCamera.pitch, this.startPivotPosition = this.orbitCamera.pivotPoint.clone())
}, KeyboardInput.prototype.update = function (t) {
    !0 === this.entity.enabled && this.orbitCamera && this.app.keyboard.wasPressed(pc.KEY_SPACE) && (this.orbitCamera.reset(this.startYaw, this.startPitch, this.startDistance), this.orbitCamera.pivotPoint = this.startPivotPosition)
};
var Hotspot = pc.createScript("hotspot");
Hotspot.attributes.add("cameraEntity", {
    type: "entity",
    title: "Camera Entity"
}), Hotspot.attributes.add("radius", {
    type: "number",
    title: "Radius"
}), Hotspot.attributes.add("fadeDropOff", {
    type: "number",
    default: .4,
    title: "Fade Drop Off",
    description: "When to start fading out hotspot relative to the camera direction. 1 for when hotspot is directly inline with the camera. 0 for never."
}), Hotspot.prototype.initialize = function () {
    this.hitArea = new pc.BoundingSphere(this.entity.getPosition(), this.radius), this.ray = new pc.Ray, this.defaultForwardDirection = this.entity.forward.clone(), this.directionToCamera = new pc.Vec3, this.sprite = this.entity.children[0], this.tooltip = this.sprite.children[0], this.initialScale = this.entity.getLocalScale().clone(), this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this), this.app.touch && this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this), this.sprite.enabled = !1
}, Hotspot.prototype.update = function (t) {
    var i = this.cameraEntity.getPosition();
    this.entity.lookAt(i), this.directionToCamera.sub2(i, this.entity.getPosition()), this.directionToCamera.normalize();
    var e = this.directionToCamera.dot(this.defaultForwardDirection);
    if (e < 0) this.sprite.enabled && (this.sprite.enabled = !1, !0 === this.tooltip.script.htmltooltip.isVisible && this.tooltip.script.htmltooltip.fadeOut()); else {
        this.sprite.enabled || (this.sprite.enabled = !0);
        for (var o = this.sprite.model.meshInstances, s = pc.math.clamp(e / this.fadeDropOff, 0, 1), a = 0; a < o.length; ++a) o[a].setParameter("material_opacity", s);
        var r = this.initialScale.clone().scale(pc.math.clamp(s, .1, 1));
        this.entity.setLocalScale(r)
    }
}, Hotspot.prototype.doRayCast = function (t) {
    this.sprite.enabled && (this.cameraEntity.camera.screenToWorld(t.x, t.y, this.cameraEntity.camera.farClip, this.ray.direction), this.ray.origin.copy(this.cameraEntity.getPosition()), this.ray.direction.sub(this.ray.origin).normalize(), this.hitArea.intersectsRay(this.ray) && this.entity.fire("pulse:start"))
}, Hotspot.prototype.onMouseDown = function (t) {
    t.button == pc.MOUSEBUTTON_LEFT && this.doRayCast(t)
}, Hotspot.prototype.onTouchStart = function (t) {
    1 == t.touches.length && (this.doRayCast(t.touches[0]), t.event.preventDefault())
};
var Pulse = pc.createScript("pulse");
Pulse.attributes.add("pulseTimeSecs", {
    type: "number",
    default: 2,
    title: "Pulse Time Secs"
}), Pulse.attributes.add("screenEntity", {
    type: "entity",
    title: "Screen Entity"
}), Pulse.prototype.initialize = function () {
    this.secsSinceStart = this.pulseTimeSecs + 1, this.entity.on("pulse:start", this.onStartEvent, this), this.sprite = this.entity.children[0], this.tooltip = this.entity.children[0].children[0].script.htmltooltip
}, Pulse.prototype.update = function (t) {
    if (this.secsSinceStart += t, this.secsSinceStart <= this.pulseTimeSecs) {
        var e = this.secsSinceStart / this.pulseTimeSecs, i = .3 * (2 * Math.abs(e - .5)) + .7,
            s = this.entity.getLocalScale();
        s.set(i, i, i), this.entity.setLocalScale(s)
    } else this.entity.script.constantSizeInscreen.enabled = !0;
    this.updateTooltipPos()
}, Pulse.prototype.onStartEvent = function () {
    this.secsSinceStart = 0, this.entity.script.constantSizeInscreen.enabled = !1;
    var t = this;
    setTimeout(function () {
        t.showTooltip(t)
    }, 1e3 * this.pulseTimeSecs)
}, Pulse.prototype.showTooltip = function (t) {
    t.tooltip.fadeIn()
}, Pulse.prototype.updateTooltipPos = function () {
    var t = this.entity.getPosition(), e = new pc.Vec3;
    this.entity.script.hotspot.cameraEntity.camera.worldToScreen(t, e);
    var i = this.app.graphicsDevice.maxPixelRatio;
    e.x *= i, e.y *= i;
    this.screenEntity.screen.scale, this.app.graphicsDevice;
    var s = new pc.Vec3(e.x, e.y, 0);
    !0 === this.sprite.enabled && this.tooltip.setPosition(s)
};
var Ui = pc.createScript("htmltooltip"), isFirstOpen = !0;
Ui.attributes.add("css", {
    type: "asset",
    assetType: "css",
    title: "CSS Asset"
}), Ui.attributes.add("html", {
    type: "asset",
    assetType: "html",
    title: "HTML Asset"
}), Ui.prototype.initialize = function () {
    this.style = document.createElement("style"), document.head.appendChild(this.style), this.style.innerHTML = this.css.resource || "", this.div = document.createElement("div"), this.div.classList.add("container"), this.div.innerHTML = this.html.resource || "", document.body.appendChild(this.div), this.isVisible = !1
}, Ui.prototype.initTooltip = function () {
}, Ui.prototype.setPosition = function (t) {
    this.div.style.top = t.y.toString() + "px", this.div.style.left = t.x.toString() + "px"
}, Ui.prototype.fadeIn = function (t) {
    this.isVisible = !0, this.div.classList.remove(["animated", "fadeIn", "fadeOut"]), this.div.offsetWidth, this.div.classList.add(["animated", "fadeIn"])
}, Ui.prototype.fadeOut = function (t) {
    this.isVisible = !1, this.div.classList.remove(["animated", "fadeIn", "fadeOut"]), this.div.offsetWidth, this.div.classList.add(["animated", "fadeOut"])
};
var ConstantSizeInscreen = pc.createScript("constantSizeInscreen");
ConstantSizeInscreen.attributes.add("factor", {
    type: "number",
    default: 1,
    title: "Size Factor"
}), ConstantSizeInscreen.prototype.initialize = function () {
    this.initialScale = this.entity.getLocalScale(), this.cameraEntity = this.entity.script.hotspot.cameraEntity
}, ConstantSizeInscreen.prototype.update = function (t) {
    var e = this.cameraEntity.getPosition().distance(this.entity.getPosition()),
        i = this.initialScale.scale(e * Math.tan(.5 * this.cameraEntity.camera.fov * this.factor * Math.PI / 180));
    this.entity.setLocalScale(i)
};
var ChangeColor = pc.createScript("changeColor");
ChangeColor.prototype.initialize = function () {
    this.app.on("color:set", function (e) {
        this.setColor(e)
    }, this)
}, ChangeColor.prototype.setColor = function (e) {
    var o = 0;
    switch (e) {
        case"red":
            o = 0, this.entity.model.material.diffuse = new pc.Color(1, 0, 0);
            break;
        case"green":
            o = 1, this.entity.model.material.diffuse = new pc.Color(0, 1, 0);
            break;
        case"black":
            o = 2, this.entity.model.material.diffuse = new pc.Color(0, 0, 0);
            break;
        case"blue":
            o = 2, this.entity.model.material.diffuse = new pc.Color(0, 0, 1);
            break;
        default:
            console.log("Unexpected color : " + e)
    }
    this.entity.model.material.update(), this.app.fire("ondemand:updateColor", o)
}, ChangeColor.prototype.update = function (e) {
    this.app.keyboard.wasPressed(pc.KEY_B) && this.app.fire("color:set", "black"), this.app.keyboard.wasPressed(pc.KEY_G) && this.app.fire("color:set", "green")
};
var ChangeEnv = pc.createScript("changeEnv");
ChangeEnv.attributes.add("envOne", {
    type: "asset",
    assetType: "cubemap",
    title: "Cubemap One"
}), ChangeEnv.attributes.add("envTwo", {
    type: "asset",
    assetType: "cubemap",
    title: "Cubemap Two"
}), ChangeEnv.prototype.initialize = function () {
    this.app.on("env:set", function (e) {
        this.setEnv(e)
    }, this)
}, ChangeEnv.prototype.setEnv = function (e) {
    var s = 0;
    switch (e) {
        case"heli":
            s = 0, this.app.scene.skyboxMip = 3, this.envOne.loadFaces = !0, this.app.assets.load(this.envOne), this.app.scene.setSkybox(this.envOne.resources);
            break;
        case"bridge":
            s = 1, this.app.scene.skyboxMip = 1, this.envTwo.loadFaces = !0, this.app.assets.load(this.envTwo), this.app.scene.setSkybox(this.envTwo.resources);
            break;
        default:
            console.log("Unexpected env : " + e)
    }
    this.app.fire("ondemand:updateEnv", s)
}, ChangeEnv.prototype.update = function (e) {
    this.app.keyboard.wasPressed(pc.KEY_C) && this.app.fire("env:set", "heli"), this.app.keyboard.wasPressed(pc.KEY_V) && this.app.fire("env:set", "bridge")
};
var OrbitCameraPov = pc.createScript("orbitCameraPov");
OrbitCameraPov.attributes.add("focusEntity", {
    type: "entity",
    title: "Focus Entity",
    description: "Entity for the camera to focus on. If blank, then the camera will use the whole scene"
}), OrbitCameraPov.attributes.add("pitchAngle", {
    type: "number",
    default: 0,
    min: -90,
    max: 0,
    title: "Pitch Angle (degrees)"
}), OrbitCameraPov.attributes.add("yawAngle", {
    type: "number",
    default: 0,
    min: 0,
    max: 360,
    title: "Yaw Angle (degrees)"
}), OrbitCameraPov.attributes.add("distance", {
    type: "number",
    default: 2,
    min: 0,
    max: 20,
    title: "Distance to Target"
}), OrbitCameraPov.attributes.add("frameOnStart", {
    type: "boolean",
    default: !0,
    title: "Frame on Start",
    description: 'Frames the entity or scene at the start of the application."'
}), Object.defineProperty(OrbitCameraPov.prototype, "pivotPoint", {
    get: function () {
        return this._pivotPoint
    }, set: function (t) {
        this._pivotPoint.copy(t)
    }
}), OrbitCameraPov.prototype.focus = function (t) {
    this._buildAabb(t, 0);
    this._modelsAabb.halfExtents;
    this._pivotPoint.copy(this._modelsAabb.center)
}, OrbitCameraPov.distanceBetween = new pc.Vec3, OrbitCameraPov.prototype.resetAndLookAtPoint = function (t, i) {
    this.pivotPoint.copy(i), this.entity.setPosition(t), this.entity.lookAt(i);
    var e = OrbitCamera.distanceBetween;
    e.sub2(i, t), this.distance = e.length(), this.pivotPoint.copy(i);
    var a = this.entity.getRotation();
    this.yaw = this._calcYaw(a), this.pitch = this._calcPitch(a, this.yawAngle), this._updatePosition()
}, OrbitCameraPov.prototype.resetAndLookAtEntity = function (t, i) {
    this._buildAabb(i, 0), this.resetAndLookAtPoint(t, this._modelsAabb.center)
}, OrbitCameraPov.prototype.reset = function (t, i, e) {
    this.pitch = i, this.yaw = t, this.distance = e
}, OrbitCameraPov.prototype.initialize = function () {
    this.entity.enabled = !1;
    var t = this, i = function () {
        t._checkAspectRatio()
    };
    window.addEventListener("resize", i, !1), this._checkAspectRatio(), this._modelsAabb = new pc.BoundingBox, this._buildAabb(this.focusEntity || this.app.root, 0), this.entity.lookAt(this._modelsAabb.center), this._pivotPoint = new pc.Vec3, this._pivotPoint.copy(this._modelsAabb.center);
    this.entity.getRotation();
    this._yaw = this.yawAngle, this._pitch = this.pitchAngle, this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0), this._distance = this.distance, this._targetYaw = this._yaw, this._targetPitch = this._pitch, this._targetDistance = this._distance, this.on("attr:focusEntity", function (t, i) {
        this.frameOnStart ? this.focus(t || this.app.root) : this.resetAndLookAtEntity(this.entity.getPosition(), t || this.app.root)
    }), this.on("attr:frameOnStart", function (t, i) {
        t && this.focus(this.focusEntity || this.app.root)
    }), this.on("destroy", function () {
        window.removeEventListener("resize", i, !1)
    }), this.on("attr:pitchAngle", function (t, i) {
        this._pitch = this.pitchAngle
    }), this.on("attr:yawAngle", function (t, i) {
        this._yaw = this.yawAngle
    }), this.on("attr:distance", function (t, i) {
        this._distance = this.distance
    })
}, OrbitCameraPov.prototype.update = function (t) {
    this._updatePosition()
}, OrbitCameraPov.prototype._updatePosition = function () {
    this.entity.setLocalPosition(0, 0, 0), this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0);
    var t = this.entity.getPosition();
    t.copy(this.entity.forward), t.scale(-this._distance), t.add(this.pivotPoint), this.entity.setPosition(t)
}, OrbitCameraPov.prototype._checkAspectRatio = function () {
    var t = this.app.graphicsDevice.height, i = this.app.graphicsDevice.width;
    this.entity.camera.horizontalFov = t > i
}, OrbitCameraPov.prototype._buildAabb = function (t, i) {
    var e = 0;
    if (t.model) {
        var a = t.model.meshInstances;
        for (e = 0; e < a.length; e++) 0 === i ? this._modelsAabb.copy(a[e].aabb) : this._modelsAabb.add(a[e].aabb), i += 1
    }
    for (e = 0; e < t.children.length; ++e) i += this._buildAabb(t.children[e], i);
    return i
}, OrbitCameraPov.prototype._calcYaw = function (t) {
    var i = new pc.Vec3;
    return t.transformVector(pc.Vec3.FORWARD, i), Math.atan2(-i.x, -i.z) * pc.math.RAD_TO_DEG
}, OrbitCameraPov.quatWithoutYaw = new pc.Quat, OrbitCameraPov.yawOffset = new pc.Quat, OrbitCameraPov.prototype._calcPitch = function (t, i) {
    var e = OrbitCameraPov.quatWithoutYaw, a = OrbitCameraPov.yawOffset;
    a.setFromEulerAngles(0, -i, 0), e.mul2(a, t);
    var o = new pc.Vec3;
    return e.transformVector(pc.Vec3.FORWARD, o), Math.atan2(o.y, -o.z) * pc.math.RAD_TO_DEG
};
var CameraManager = pc.createScript("cameraManager");
CameraManager.attributes.add("interpolationDuration", {
    type: "number",
    default: 2
}), CameraManager.attributes.add("currentCamera", {
    type: "number",
    enum: [{freeCamera: 0}, {POV1: 1}, {POV2: 2}, {POV3: 3}],
    default: 0
}), CameraManager.prototype.initialize = function () {
    this.on("attr:currentCamera", function (e, t) {
        this.updateCameraInEditor(e, t)
    }), this.freeCameraEntity = this.entity.children[0], this.freeCameraScript = this.entity.children[0].camera, this.freeCamera = this.entity.children[0].script.orbitCamera, this.originalInertiaFactor = this.freeCamera.inertiaFactor, this.app.on("camera:set", function (e) {
        this.app.fire("orbit:startmoving"), this.moveToCameraIndex(e)
    }, this)
}, CameraManager.prototype.updateCameraInEditor = function (e, t) {
    this.entity.children[t].enabled = !1, this.entity.children[e].enabled = !0, this.entity.children[e].enabled = !1, this.entity.children[e].enabled = !0
}, CameraManager.prototype.moveToCameraIndex = function (e) {
    var t = this;
    this.freeCameraEntity.enabled = !0, this.prepareForInterpolation();
    var a = this.entity.children[e].script.orbitCameraPov.yawAngle,
        i = this.entity.children[e].script.orbitCameraPov.pitchAngle,
        r = this.entity.children[e].script.orbitCameraPov.distance, n = this.entity.children[e].camera.fov,
        o = {value: this.freeCamera.yaw.valueOf()};
    this.tweenYaw = this.entity.tween(o).to({value: a}, this.interpolationDuration, pc.CubicInOut).on("update", function () {
        t.freeCamera.yaw = o.value
    }).on("complete", function () {
        t.restoreAfterInterpolation()
    });
    var s = {value: this.freeCamera.pitch.valueOf()};
    this.tweenPitch = this.entity.tween(s).to({value: i}, this.interpolationDuration, pc.CubicInOut).on("update", function () {
        t.freeCamera.pitch = s.value
    });
    var c = {value: this.freeCamera.distance.valueOf()};
    this.tweenDistance = this.entity.tween(c).to({value: r}, this.interpolationDuration, pc.CubicInOut).on("update", function () {
        t.freeCamera.distance = c.value
    });
    var h = {value: this.freeCameraScript.fov.valueOf()};
    this.tweenFOV = this.entity.tween(h).to({value: n}, this.interpolationDuration, pc.CubicInOut).on("update", function () {
        t.freeCameraScript.fov = h.value
    }), this.tweenYaw.start(), this.tweenPitch.start(), this.tweenDistance.start(), this.tweenFOV.start()
}, CameraManager.prototype.prepareForInterpolation = function () {
    this.freeCamera.inertiaFactor = 0, this.entity.children[0].script.touchInput.enabled = !1, this.entity.children[0].script.mouseInput.enabled = !1, this.entity.children[0].script.keyboardInput.enabled = !1
}, CameraManager.prototype.restoreAfterInterpolation = function () {
    this.freeCamera.inertiaFactor = this.originalInertiaFactor, this.entity.children[0].script.touchInput.enabled = !0, this.entity.children[0].script.mouseInput.enabled = !0, this.entity.children[0].script.keyboardInput.enabled = !0, this.app.fire("orbit:askForNewImage"), console.log("restore")
}, CameraManager.prototype.update = function (e) {
    this.app.keyboard.wasPressed(pc.KEY_1) ? this.app.fire("camera:set", 1) : this.app.keyboard.wasPressed(pc.KEY_2) ? this.app.fire("camera:set", 2) : this.app.keyboard.wasPressed(pc.KEY_3) && this.app.fire("camera:set", 3)
};
pc.extend(pc, function () {
    var t = function (t) {
        this._app = t, this._tweens = [], this._add = []
    };
    t.prototype = {
        add: function (t) {
            return this._add.push(t), t
        }, update: function (t) {
            for (var i = 0, e = this._tweens.length; i < e;) this._tweens[i].update(t) ? i++ : (this._tweens.splice(i, 1), e--);
            this._add.length && (this._tweens = this._tweens.concat(this._add), this._add.length = 0)
        }
    };
    var i = function (t, i, e) {
        pc.events.attach(this), this.manager = i, e && (this.entity = null), this.time = 0, this.complete = !1, this.playing = !1, this.stopped = !0, this.pending = !1, this.target = t, this.duration = 0, this._currentDelay = 0, this.timeScale = 1, this._reverse = !1, this._delay = 0, this._yoyo = !1, this._count = 0, this._numRepeats = 0, this._repeatDelay = 0, this._from = !1, this._slerp = !1, this._fromQuat = new pc.Quat, this._toQuat = new pc.Quat, this._quat = new pc.Quat, this.easing = pc.Linear, this._sv = {}, this._ev = {}
    }, e = function (t) {
        var i;
        return t instanceof pc.Vec2 ? i = {x: t.x, y: t.y} : t instanceof pc.Vec3 ? i = {
            x: t.x,
            y: t.y,
            z: t.z
        } : t instanceof pc.Vec4 ? i = {x: t.x, y: t.y, z: t.z, w: t.w} : t instanceof pc.Quat ? i = {
            x: t.x,
            y: t.y,
            z: t.z,
            w: t.w
        } : t instanceof pc.Color ? (i = {r: t.r, g: t.g, b: t.b}, void 0 !== t.a && (i.a = t.a)) : i = t, i
    };
    i.prototype = {
        to: function (t, i, n, s, r, h) {
            return this._properties = e(t), this.duration = i, n && (this.easing = n), s && this.delay(s), r && this.repeat(r), h && this.yoyo(h), this
        }, from: function (t, i, n, s, r, h) {
            return this._properties = e(t), this.duration = i, n && (this.easing = n), s && this.delay(s), r && this.repeat(r), h && this.yoyo(h), this._from = !0, this
        }, rotate: function (t, i, n, s, r, h) {
            return this._properties = e(t), this.duration = i, n && (this.easing = n), s && this.delay(s), r && this.repeat(r), h && this.yoyo(h), this._slerp = !0, this
        }, start: function () {
            var t, i, e, n;
            if (this.playing = !0, this.complete = !1, this.stopped = !1, this._count = 0, this.pending = this._delay > 0, this._reverse && !this.pending ? this.time = this.duration : this.time = 0, this._from) {
                for (t in this._properties) this._properties.hasOwnProperty(t) && (this._sv[t] = this._properties[t], this._ev[t] = this.target[t]);
                this._slerp && (this._toQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z), i = void 0 !== this._properties.x ? this._properties.x : this.target.x, e = void 0 !== this._properties.y ? this._properties.y : this.target.y, n = void 0 !== this._properties.z ? this._properties.z : this.target.z, this._fromQuat.setFromEulerAngles(i, e, n))
            } else {
                for (t in this._properties) this._properties.hasOwnProperty(t) && (this._sv[t] = this.target[t], this._ev[t] = this._properties[t]);
                this._slerp && (this._fromQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z), i = void 0 !== this._properties.x ? this._properties.x : this.target.x, e = void 0 !== this._properties.y ? this._properties.y : this.target.y, n = void 0 !== this._properties.z ? this._properties.z : this.target.z, this._toQuat.setFromEulerAngles(i, e, n))
            }
            return this._currentDelay = this._delay, this.manager.add(this), this
        }, pause: function () {
            this.playing = !1
        }, resume: function () {
            this.playing = !0
        }, stop: function () {
            this.playing = !1, this.stopped = !0
        }, delay: function (t) {
            return this._delay = t, this.pending = !0, this
        }, repeat: function (t, i) {
            return this._count = 0, this._numRepeats = t, this._repeatDelay = i || 0, this
        }, loop: function (t) {
            return t ? (this._count = 0, this._numRepeats = 1 / 0) : this._numRepeats = 0, this
        }, yoyo: function (t) {
            return this._yoyo = t, this
        }, reverse: function () {
            return this._reverse = !this._reverse, this
        }, chain: function () {
            for (var t = arguments.length; t--;) t > 0 ? arguments[t - 1]._chained = arguments[t] : this._chained = arguments[t];
            return this
        }, update: function (t) {
            if (this.stopped) return !1;
            if (!this.playing) return !0;
            if (!this._reverse || this.pending ? this.time += t * this.timeScale : this.time -= t * this.timeScale, this.pending) {
                if (!(this.time > this._currentDelay)) return !0;
                this._reverse ? this.time = this.duration - (this.time - this._currentDelay) : this.time = this.time - this._currentDelay, this.pending = !1
            }
            var i = 0;
            (!this._reverse && this.time > this.duration || this._reverse && this.time < 0) && (this._count++, this.complete = !0, this.playing = !1, this._reverse ? (i = this.duration - this.time, this.time = 0) : (i = this.time - this.duration, this.time = this.duration));
            var e, n, s = this.time / this.duration, r = this.easing(s);
            for (var h in this._properties) this._properties.hasOwnProperty(h) && (e = this._sv[h], n = this._ev[h], this.target[h] = e + (n - e) * r);
            if (this._slerp && this._quat.slerp(this._fromQuat, this._toQuat, r), this.entity && (this.entity._dirtifyLocal(), this.element && this.entity.element && (this.entity.element[this.element] = this.target), this._slerp && this.entity.setLocalRotation(this._quat)), this.fire("update", t), this.complete) {
                var a = this._repeat(i);
                return a ? this.fire("loop") : (this.fire("complete", i), this.entity && this.entity.off("destroy", this.stop, this), this._chained && this._chained.start()), a
            }
            return !0
        }, _repeat: function (t) {
            if (this._count < this._numRepeats) {
                if (this._reverse ? this.time = this.duration - t : this.time = t, this.complete = !1, this.playing = !0, this._currentDelay = this._repeatDelay, this.pending = !0, this._yoyo) {
                    for (var i in this._properties) {
                        var e = this._sv[i];
                        this._sv[i] = this._ev[i], this._ev[i] = e
                    }
                    this._slerp && (this._quat.copy(this._fromQuat), this._fromQuat.copy(this._toQuat), this._toQuat.copy(this._quat))
                }
                return !0
            }
            return !1
        }
    };
    var n = function (t) {
        return 1 - s(1 - t)
    }, s = function (t) {
        return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
    };
    return {
        TweenManager: t, Tween: i, Linear: function (t) {
            return t
        }, QuadraticIn: function (t) {
            return t * t
        }, QuadraticOut: function (t) {
            return t * (2 - t)
        }, QuadraticInOut: function (t) {
            return (t *= 2) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1)
        }, CubicIn: function (t) {
            return t * t * t
        }, CubicOut: function (t) {
            return --t * t * t + 1
        }, CubicInOut: function (t) {
            return (t *= 2) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
        }, QuarticIn: function (t) {
            return t * t * t * t
        }, QuarticOut: function (t) {
            return 1 - --t * t * t * t
        }, QuarticInOut: function (t) {
            return (t *= 2) < 1 ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2)
        }, QuinticIn: function (t) {
            return t * t * t * t * t
        }, QuinticOut: function (t) {
            return --t * t * t * t * t + 1
        }, QuinticInOut: function (t) {
            return (t *= 2) < 1 ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2)
        }, SineIn: function (t) {
            return 0 === t ? 0 : 1 === t ? 1 : 1 - Math.cos(t * Math.PI / 2)
        }, SineOut: function (t) {
            return 0 === t ? 0 : 1 === t ? 1 : Math.sin(t * Math.PI / 2)
        }, SineInOut: function (t) {
            return 0 === t ? 0 : 1 === t ? 1 : .5 * (1 - Math.cos(Math.PI * t))
        }, ExponentialIn: function (t) {
            return 0 === t ? 0 : Math.pow(1024, t - 1)
        }, ExponentialOut: function (t) {
            return 1 === t ? 1 : 1 - Math.pow(2, -10 * t)
        }, ExponentialInOut: function (t) {
            return 0 === t ? 0 : 1 === t ? 1 : (t *= 2) < 1 ? .5 * Math.pow(1024, t - 1) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
        }, CircularIn: function (t) {
            return 1 - Math.sqrt(1 - t * t)
        }, CircularOut: function (t) {
            return Math.sqrt(1 - --t * t)
        }, CircularInOut: function (t) {
            return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
        }, BackIn: function (t) {
            return t * t * (2.70158 * t - 1.70158)
        }, BackOut: function (t) {
            return --t * t * (2.70158 * t + 1.70158) + 1
        }, BackInOut: function (t) {
            var i = 2.5949095;
            return (t *= 2) < 1 ? t * t * ((i + 1) * t - i) * .5 : .5 * ((t -= 2) * t * ((i + 1) * t + i) + 2)
        }, BounceIn: n, BounceOut: s, BounceInOut: function (t) {
            return t < .5 ? .5 * n(2 * t) : .5 * s(2 * t - 1) + .5
        }, ElasticIn: function (t) {
            var i, e = .1;
            return 0 === t ? 0 : 1 === t ? 1 : (!e || e < 1 ? (e = 1, i = .1) : i = .4 * Math.asin(1 / e) / (2 * Math.PI), -e * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - i) * (2 * Math.PI) / .4))
        }, ElasticOut: function (t) {
            var i, e = .1;
            return 0 === t ? 0 : 1 === t ? 1 : (!e || e < 1 ? (e = 1, i = .1) : i = .4 * Math.asin(1 / e) / (2 * Math.PI), e * Math.pow(2, -10 * t) * Math.sin((t - i) * (2 * Math.PI) / .4) + 1)
        }, ElasticInOut: function (t) {
            var i, e = .1;
            return 0 === t ? 0 : 1 === t ? 1 : (!e || e < 1 ? (e = 1, i = .1) : i = .4 * Math.asin(1 / e) / (2 * Math.PI), (t *= 2) < 1 ? e * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - i) * (2 * Math.PI) / .4) * -.5 : e * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - i) * (2 * Math.PI) / .4) * .5 + 1)
        }
    }
}()), function () {
    pc.Application.prototype.addTweenManager = function () {
        this._tweenManager = new pc.TweenManager(this), this.on("update", function (t) {
            this._tweenManager.update(t)
        })
    }, pc.Application.prototype.tween = function (t) {
        return new pc.Tween(t, this._tweenManager)
    }, pc.Entity.prototype.tween = function (t, i) {
        var e = this._app.tween(t);
        return e.entity = this, this.once("destroy", e.stop, e), i && i.element && (e.element = i.element), e
    };
    var t = pc.Application.getApplication();
    t && t.addTweenManager()
}();
pc.script.createLoadingScreen(function (A) {
    var E, I;
    E = ["body {", "    background-color: #000000;", "}", "#application-splash-wrapper {", "    position: absolute;", "    top: 0;", "    left: 0;", "    height: 100%;", "    width: 100%;", "    background-color: #000000;", "}", "#application-splash {", "    position: absolute;", "    top: calc(50% - 132px);", "    width: 264px;", "    left: calc(50% - 132px);", "}", "#application-splash img {", "    width: 100%;", "}", "#progress-bar-container {", "    margin: 20px auto 0 auto;", "    height: 2px;", "    width: 100%;", "    background-color: #000000;", "}", "#progress-bar {", "    width: 0%;", "    height: 100%;", "    background-color: #ffffff;", "}", "@media (max-width: 480px) {", "    #application-splash {", "        width: 170px;", "        left: calc(50% - 85px);", "    }", "}"].join("\n"), (I = document.createElement("style")).type = "text/css", I.styleSheet ? I.styleSheet.cssText = E : I.appendChild(document.createTextNode(E)), document.head.appendChild(I), function () {
        var A = document.createElement("div");
        A.id = "application-splash-wrapper", document.body.appendChild(A);
        var E = document.createElement("div");
        E.id = "application-splash", A.appendChild(E), E.style.display = "none";
        var I = document.createElement("div");
        I.id = "progress-bar-container", E.appendChild(I);
        var C = document.createElement("div");
        C.id = "progress-bar", I.appendChild(C)
    }(), A.on("preload:start", function () {
        var A = document.getElementById("application-splash"), E = document.createElement("img");
        E.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAQAAABecRxxAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAAXEYAAFxGARSUQ0EAAHodSURBVHja7Z13gBPF28c/u+nX+x1w3NF77ygoCiLYUFFQ7BUQGxaw/SyvvTcEewEFxYoFRLGhFEG69M4d13tJz+77R3K55C7XaBfMfPJPstkyuzvznZlnnnlGUhEIBKGK3NwJEAgEzYcQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghBECIBCEMEIABIIQRgiAQBDCCAEQCEIYIQACQQgjBEAgCGGEAAgEIYwQAIEghNE2/ZDvuIP0ANsPcDWPeX/lsR5TrX3i+ZebcGL0/HagZxr7cNEZB+2ANVzAXwyiP04+wMAwDrCPdbTG7j2Lk5ZE4/D+LqEzU7y/yvkbjZ+yVdLdJ8Vv8STtPd9VIBUTTu+ZZS4lGXM999+Kd/iYCBIowUYahchoKKcFFoqJp4RYKqggnRIU9JSRjIMCErFgxRk0mquhiFMH5GUfOGw6+pMdI1wkEkEWBvSUkkoFJcRSSAxh5BCOipME8oFI8knGSSFxVFJJXz5F73OmQrbyAS7mNvctBTlHIACCI0NBoTUSanMnxIMTHa/8+MNLTz/VKmjSpOD0irHgRCAE4IShp5TdGIKksEnkcmqv1vFDL2r1VIvmTowPOg7jau5EhBBCAE4QEjYMaIKk+AO4uG4G9B7QpfPqnS2DJF0yNux+TXnB8UUIwAnCRiyJ2IKkoEmU0Tb6/MsBxty97ubY5k6QBxUNEluC5CmFAkIATggyKlmoOIIka8vs5vGpehngomtevXObOTxIUqbBjIWw5k5GyCAE4IRgI5EEStE0d0K86dEw7HYod2olk37Mje++loLS3IkCQCUKC2XecSLB8UUIwAlAQiYLPWqQWLglsrj2nPYt4NGLzrli5GU33jXrtQx0zZ0sD1qKiQ6awdL/OkIATgAqBqLJD5pMrVLByPsgv+S174t1Iy9rkT7mjIW/tQmSToCTMPTYkZo7ISGBEIATgIsw2gTRCEAuwzqOHA4/vBlO7mKr2Rh2833rfusSNOkDDYeCpLX0X0cIwHFHwkILorE2d0K86Sng4rvAwfuvprDN9tG7k28/dfTgtE2HEoJEAmRUSoKmvfTfRgjACSCcQxAkhQvM6AxnXgvrvtub0xmFjS9xO/SZ/u10XdC44KgkUxokZsn/NkIAjjMSFky0rnd2wYlEZi/XXR9uhPnPtiUBG78fXL1syKgbb/z8njJXRHMnz4OGSkpJau5khABCAI4zLiIoILe5k+HFTj5j74E9u79bYaIUO4eY8+yQUaaI3le/80F6kNS6KhKxQdNm+i8jBOC4IuFAogXmILFpSxxi0mmd2sE7L2bSFhdG0lm2LPdQctr0e5Z/kBg0ngoa7KhBIkf/ZYQAHFdcRJLD9iAp/gD7GHsflFnWfNibaFRcyJh5+6X/vdKu29mD1/2dGCT1rkoYheQ3dzL+8wgBOK6ouIgJGnu2RC5jW44dC1+/v8bWmQK06FGJ5td3739eqxs586OLnUEiAAAyYUEzdvJfRQjAcURFoS1y0DRkJZxcdgfAry/1IRkFDXpUJHZWfjf3ohtGXnRmYn5+XHMn04NKOPuEN8BxRgjAcURPMTuJCJpMbMMoXzIZVvz+/b52ZKJ6uiYS+Sx44aIbtAyd9sCjnYJoMBCCZZLSfxUhAMcRO60xYg8SL3uZw0yYFBYNy57tSToKYRxmI3oktHyxY8XqU4dMnPbpowrhzZ1UDyp6soQAHFeEABw3ZBxkkBA09b8TM1NnQG7mDz9GkAeAQmck3NOVlj576tfJCX0uff/zYBkMlHCiJ6a5k/GfRgjAcULCThgOyoNmBCCT0f3b94TXX91EGgru0XatJ0qhkze+uTk3Nfmme7/+XIOhuRPrQQJsQWNE/S8iBOA44UKmFS2CpvhLwC0zQHH981YnTChIOIkgGpenDbCHpbNueLzvwHO679naIkjaAGCkhFyimjsZ/1mEABw3zCSiBk0PtpQh8WdOgLmfbCrvTh9isSGj5S8OE4kK6PhgzrWPa5g04+prgiXVoCcfl2gDHDeEABwXFMKIJTtoMq6GfYy5RQP8+7ye3wmnDRWAlgT03vUbDhQuX3jGhEFXpt5WWhbd3En2YKUleqwiQtBxQgjAcUFDCQ6igmZAzUJbbrwVNq/97d9+GHRdEjtllQMK8fzDOqJxT1v67LkzJkTK19784AuGIOkESDjJJiloulL/NYQAHBc0xJLtHWdvbmQOcvG42CR4+9kNhHPZuGs6lT6lAhKplDGXBCTAyYJ1N2we2OusOx5+IStoDIEKJoxBI6X/NYQAHAc0VCKT4LN4WfOiEM+MmVBSuOjLDuzmlntard/libybRzyt0aIDJCr5+YWBczuk3nj24qVtg6YNoOCgormT8R9FCMBxwEkM+WQHSf0vkUffrj2HwtzZMukkRF08OOOrKutEGe1pxx5PHzuFDz6+7vUW0RPvX7nUGDQWDB0V5AfJ0/yvIQTgmKPiJIy05k6GF4ly7rwb4IfXjazljpv0FHun2TkJpyUHPIbAMHapK98ef2+f041t1+8Pnhn5EpFBE1Llv4UQgGOOgzDaURkkNZZEKYPDRl8NP39VlJ9KOFPu9P1fRU9XtpPo+S3z2avj74Updz9ya0pzJ96LkWLMYl7AcUAIwDEnjAJKg6T4g8weHrgpTAdfPpfLVs4Z1SIVJMl3Dw07KfCkWGH94WWLR50z8oYZd2+1BcusANASHSQ2if8WQgCOMS60JGNv7mR4sdKeS6fDxm3v/92ORO66r+YeFtKJpszTCZCx896zo86JMk6+5tW304Km0BnJxB40IxP/HYQAHGOMlLAbXZA0VmUyGD+qXTp8/0IsLUhrM3RkzX0qSaYfe7zutvHsWL5nX4d2Y+5+8G2CZqVeFUjG0tzJ+M8hBOCYImELqjFrBQPXzoDCijfmhbGJqdNrd01cxGIix5tqDQf49IWHZvfodP2wb/9KDhIpc0tAsLRH/jsIATim2EggFltzJ8ODRAG90844C359J9oZT4pu5I2191KQGcBuErxbolj1QelL0cZLZ679q3XQWDMkZP4NInH9byAE4Bgi4+QwStAIAOzhjukA77+iYQt3XR0fYN1tCRcRlGDxRgSW2Wj98YOJU888LzllU06wzAqQsFJBsKTmv4IQgGOIlRTiKQ4SBxqJCiK0Q2+Cf5aZD8Vj5dJ7Ibtc40iqEfavjNYModQ7KQhi+ePliVPhvDtevD86SDoBKrHEUdDcyfiPIQTgmCEhkYsBNUiaqTLZzLgqKRw+fzqLLM49pXtn+HN2vzOSBvnvqRBOBbuo1gWVpbv/WT7gtKumvPjAXjVYZuJpKCU8aFYu+G8gBOCY4SKMCHKDpP4HJw5G3gu7Dsz9VY+Ra2fC1uy/Zk+YVHvPFMLZRYq3rpc5xIvPLjgtIub8y95Y0C5I2gAOjOixeWIYCY4FQgCOGQom2gbNIuAyGZw/uG9X+OFlC60ZnHzOBbBuju4QLWrv7aInbX3MgJDI3sWFWfEtJ89cvqBN0IgaaCjEKVoBxwwhAMcICSstCQ8iF6Bwxt8HJY6P3m1LBRffBrDsjeEB97XQGi0lPqP+MvuZ9dojz3TpPbrP7xuDxylYoRSCZmTi5EcIwDFCxsQ+5CCp/yXKSEoadiGsnptvjqGc4dPg+5W/F10X61Rrv3QbEaRT7mMGBC1b57ie0sh9Zs67XBc0I/AK8UiUN3cy/jMIATgmSFSSTmrQeKpJ2Lh+mgx88UJrMpl8WasYePOZWJKMjgAv3UoS7VnnF3grjH/Lflow9ooJE7+allEULMNvMk6Kg8Y/8eRHCMAxQSGCHLKaOxleLFg591b4Z9XSHQaKOGsmHMrZ9N1VaJRAbRSFSBQ2k+yzTSKTOc+NvUKSuk/5+an2QdIGUIFErEHS0jr5EQJwDJCwoaEFliDpm0rs45pLEuNg9nMFtOKKXkP6wNev5pNURzGWUGhNODq/O0hj+ebt67v2m3brN08pGIOk0Gkpp9JPqgRHjhCAY4BCBLnsCBpbuYtDnD8TsnP//eY0zFw8A8zqwjl96EUxbQIeU04X2uH0a1xrMPP2sy9/Ft+ixwWffds6SARARSUhSNojJz9CAI4BCiqxSEFT/2cyocegATB/1i5akBwzehKs/HRt6bmE1emm7CCScDL8XG0dxLN8YeWb4bF3zVz5bXqQ3B/IqFQEiRyd7AgBOGoUJNoH0RIg4OTyGWBTV78xhAIumaKR4Itnu9IPU53BNa0k0JcK/MOAyeznwzemPdTnlDM77dwVLM1ulXAOBdGA68mMEICjRk8h2wkPmkZpBcmR50+CpQuXF8dRwYQ7YOvGHzepuDDWU4tr0VNSy8VGy6+vT3sIRtw9f3LnoBE5FZWIoEnNyYwQgKPGRRpanEFiAZApZuJkSQMrnu/NAcafm5QCrz2bSSJp9c5SsNKdjUTWkog9eb8uOnPcuGs/urPEEtPct+dBxcj+IJlzcXIjBOAo0WDjEPFBswi4HQ2T74Tdm5ets7ObifdBUcnWz7qRRltK6znSRRjZ7K+xCJfEQeY/c+a4cP2gG596vUOQFDoJFxIJIlLwUSME4KiQsBGOK4gWAT/IpDEJreCl57cTwbiOQ4fB3Dkb1XhMxFNcz5EWWhLFDr8ZAQA6Plp9x46eXW64a/7rKmEECwr2IGl1ncwIATgqXGhJDaq+qMwtM8Fcun5+T6xcdTe4WPdqX1Q6NzBRyYmeHhR4A4RXn1HHjy/0fLdNmwtGrPy9TZDYOiS0ONjb3Mk46RECcBRIqJhJCJrmv0Q+I9sPGAFvvbVfaU1L47hr4cdvf8jtQAlx6BuQKiMJFAVoy+h4Z+7Nr0aHX33/j7/nB02ta6DQJ4qR4MgQAnAUuIggisNBUyQ07OOauwA2vdqGHM65QWuA1c/1JgnoVK8FAKCCLnTDEKBQ7XH8/O4ld/Qe3bZ1fkZ8kLR47LQkip0iSNhRIQTgKNBQRkoQDUeV09twxfXw1+J1WXpkpt0FB3Z9vyKFHFoQ3eDIuY04Iiis1c+XMPDly5fcIXPDnZPv1gbN/drIRUwNPjqEABwxKjqiOUSwZEGZfUy5xmiEN5/di8x5Z6S0g9ef30I5BcQTR1EDZ3AQh5lNxNX6R+Xbgz/+MmbkqTclzCx3BovkWUijJIhCsJ6MCAE4YjRUog8iC4CddKbfDRl7v13eHpg+E+zmFXM7EY6NdugaHMJTMJLOFmJr/SNh5qdnxoxMibzmyhc/bBskAgCl5JAUJAJ8ciIE4IhRiKYwiGYAZnHW8PRO8N5L0bSmXergs+Hdd/fZO+Akks4oDcbSU9DQg1+QA9xTC75YdvOhLmln3/P8h/nomvt2vSmOQI+1uZNxEiME4IhxEU5EkAyKuUOS3TUTbNbF78eyngunA6x9JQUDMnFEN6KYSFiIJxFtgGwRQRF/vdLlpX7dLx+0ak3rILlvCRUbJc2djJMYIQBHiJ1w0qls7mR4kCjktJRTz4VvP3BY02ijvewmWPXrhv2dkSimA20bFUargta0IIOIAP8l8d7blz4brZt436qL5aAZ+TDgFIOBR4EQgCNCxURug0a1E4fMTl6+QwN8+WIlq7jqiqhImPvMXhRUCkglolHhylyYiCYjoMdAHAcq18078/pTLpISNhQEy3IhoCFKxAg8YoQAHBEu9LQMmv4/VNBTHjcFfv3z873daMu0eyHj0Mc/R1MJVNASU6MKrIswenOQmAB7y9j55Pkzr9dyy7RHHosLGgEwkoU1aN7EyYYQgCPCSAW7CJYRcQ37uOWypBj449l09jFsYMfuMP+VMNqhoGKgTSOnzUjocLKF+IAFysnWHWtXDxwy9tZ7H9sRNLMCVFQig8QmcfIhBOAIkLATGSSFH9zj99fOgL1ZL/+QSgz33AcOx8fvmChCxYyJ5EaPlltIJZwKDAH+kynl3WcHft0yYcr4d75MDppCp1ASNIOxJxtCAI4AG0n0wBEkEiBxmBF9evWGX15NIZWeCSMuhu8/0VT0AqCcHqRR1sizlZPOEA4GNANCIlu/yc5vkThhxm9ftg4aQ6BKBcGzcsHJhRCAJqPBRi4tg8YDTSWbp2aCVfngTR3bePJWHTD32SLPMiUFdCeswXkAVTiJw0QmCQHlTcMuPn/t9sf7DOrWY9W/CUEjgQUki6x8RIin1mTsRBPb6AJ1vJEoISFmwERYsYCydMoZdQts/Dtnx0A0gEQMXXA06Zx92EdSHf/F8NfsqY/rGHP32uuimvvmvcikiBbAESEEoMkoJGMOEDqreZDJ4blbwiX4/LkitjJlfKtE+OLZbMJQAAUzTRuyUzFQhFrH/cmsKPr987MuHX/lC7dtr4hownmP5zPIwxUkrZGTDSEATaacwaSyg+BoAFvRcubtsGr9V5vbomf8TDiUP/trAwcAKKMlrZrkLGujJWby6rDyS5Tw0nNnXSprL5zy5gvBEZ/fSSX3BjRbChpCCECTqaA1M3iS+CDwP5PZz8Xnt02GZc9VsonzegweCL+8rqOjp2jq6dEoN+BqzCTRl60BpgS5SWD/P3s2d+h1wx2vv3AoCFbpkznMWVzQ3Mk4SREC0GQ0ZNOB8/iT+Gav/1TiuWgmZBV/tbAre7jwbrDz2uxw78IZFaQRy6EmdFgcJNKC1XUWbQ0FvPLCrLlJqWNHz/+pTbO3g6yEcWczp+HkRQjAEaCgMICvKCasWbO/RDa9Ovc5FX5/I0tty7DIy66E1Z/bC7t69zHSAluT7BUSLlrSgsQ67y2SffMrZkVETb5vzU+dmvH+3ZQRyaDmTsRJixCAI0CikHZcw9d12spPFGVcczcofPNGJ3K5+WatFt563onNU3jt6Elv8nRZJ+k4yaszc2jY5PrgrdvuHXTG0HYb9iU06dzHnkIGB0Fn7GRFCMARUskgPmE9zWkHr8BkOuta+PnbP3JaY2H4dDiwJWdtN+9rNZPQRAuA+6gkulCMqY7/JXRse5V7oc9dC2+lWdcKkAme6AQnI0IAjgiJMlpyI+8Q0Wy1j0QJ191g0sGbz5Sg57qzO7aCT58vIs5rmyijO3H1rgYQCBsxJHG4TgFQieOvwyuWnDr2hus/u7vE1pwiWElnhmCpM62C+hECcITIyGjZS1yzOcTaKGLcXbBr5+FVPdjKKfdBftk7H1t8ohTkMpTwJgsARGFhA/UtBnqIN545dazB1PeaWW+3bUZjaB4JxGEXAnCECAE4YlzYSSS6TpeZ44vEfq45o2Nb+PDF3bTgkvZjRsDit7LUTl7jnUIU6UdQOFWgDREY6rmztvy6/PDeVu3vvHvZ2/HN2Ag3MRajmAp0xAgBOAqcaOnQYKS944OKwuX3Qal580cjyOfiu8DJZ6929lnay0YybRs9DciXcrrRHuoZ5Zdx8O5Lj7zRptPYU1esSGmm0RAH4XSgIki8Mk9GhAAcBTIuDuNshuwnUUy31OGjYdG7a+2p6A1jroO1S9YdbuPTASijFRFNnAfgxk4EenKIrGefcH55//4X9cbRM2df0JhoQ8eDcjrSgopmuvp/ASEAR4GWSmzENEMDVMLKqOkAK14aRC6XXBtmgs+e6UCaT12cxwgSyT0CgbKSwCD+rrVOoH8adlq/+WDC1JHnn9ficHZzrBckk8cQoo7AxiGoQgjAUaCiRyGvGawAZsI119wE//z650EdGYy7Cw7sXbw8zG+5zGxGoTvCtBmB3fXG2pMo4LOXJkyVGX7rPQ92aAZDoEoeVwYMYi5oLEIAjhIrzhOe9WUOcttVpkh49tk8kpg4rEMneOOlvbT3KbIuLCQfcetEJhUL9S8FquXrPb//OWL4Zbd89KCdmBP8FKCcvnQT9f9RIQTgqFCQaUvYCe4EKOiZfA/kHdr3k4ntvHofmG2b3+/nt1CmFT1JRxy4vJwWdEGt174vA0ueGTE8IWbQ5W8taHuCHYIkCmhHMnkn9Kr/NYQAHBUSTjQNLrt9rK+ZxbkDO3aH11/JxchZLUedCx+//6u1o5/FP5+BtGpUMPBAWEnGwO4G6nUdHy2elpXWcsqMbxfoTnCYUBUzp2Bo9glZJzdCAI4SLfuJPqHxgWUOMWgmuJz/vtOGEq68XQJWvdS7xsyEKIZgPOKI+XYSGISN+Hr3ktjLj6/e/GzPPmN679jU6oQWRoWWpFMuLABHhRCAo8RFJLFNnG93dBQzLGHceFj68faKcGLl8ZPhrz+/39PepzesolJJ0lG4KavoiaEQa70mTgkH7755zdMGedKMq6+QTmhhLKYvXcSyYEeJEICjRE8l+Y1cduNYILOHcbfKwOsvWNEy4vLwGPjtmY6kI6GgACoaFBRaHMWymRI20kgmBQMOXEhISMgB6vj9ZX99OnLS4Ektbs0vjj2CKx1p+iyEn+DO138RIQBHiYJEKroTZgY005fbpsHmv3/eGo2OO2ZAxqHPFsdyGDs6ZFSiMWDDzGH6U3iErQCFCPbiwokdLXZKkFBwoEeHC413eFHCxmfPjZwUxg1TZjx94hZLVXBx6gm61n8ZIQBHjYEcLCeoLpI5yKSLYxLgvee6INP+lLRe8No9uSSjRUM4BiQ0WHFi5096E31EfnIqMWzjb8IpR8WAiThUbFSiw4pEOSW4kHC7BC/cdN26of3Pvv2Rp7NP2KScSqKIbeR6R4K6EQJw1NiJIvkEWQFcOLhrJmzf8uVXZrS8/yjAWRf+u2RvRTcikZCRcAESsRzkR6ZQdgTzFTWE8T2lxOJARUJFh4oGIzZUjERhwIGdQjSYyOaDGUOWtUm54bxvv293gtoAuZxJ2yPychT4IgTgqJEpI5nORzzg1hTymXBOr0Gwc30CEaznk2datmnZcfSkXqfed/lfqzr7hShzEcsWttCS0iYWE5Uo1rKHWJ/CrKKi4ERFj4SJeDQ4sOJCQkvlv067zjBt1oYfJeeJGAyUySctaFYmOpkRAnAMkLFQchQGt8Zj5oDNXB4WeeE1Os3s6wc4/v31np5T3x8+KSX9w5VPTJ/3SitSfNxxjJTyDdPQNslFR8WIg++R0QSszVXcXobuSEBl7Oe80fe9pzNAWeUOvew0HvenoOEg7ekiZgEeA4QAHAPCyWbvCamPFDb+crjLPZ8MG3HulR0HPT9p8zrZ9sQVE1beMAseernX0Oev3WepboQrRJJHITFNHC038js5JDc4j1DHQUq44+HbHgNYMueNWxRij7s/oIZDtOcVEsgS2feoEU/wGODCcIKWpXCSSFnWlDNuf+rm+zt1mvPPS9O+mB3Jx2/sWHPrgvT2F0zoMeDxKzaubusVI5V4NtCVBCyNlACVaPL4wc+pOBASMtuJSnhj3hljwOmac93ieTpij/vEKA0HSeNVkjkkMu8xQHSjTjIcpJLEcw88cFFluZYZbzwxz6i3s2Htvd2WfALt2n2w6uo7Myn2Dv6Fs5/MJoQulYHlWBoIeC5j518GnfXZ1jPGwI7193T/eV4KUcd9MLS6+GeI4n9MEAJw0uEkgvYs+2Za981/wugr39rSq18RFfZXr3z1Nhcw/eWnPtWZDnimySoksZl9RDVqmFIhiZ38RHK9tnwNhWQz5eG3fkpJgi/eeqB/7s60OiwGxxLf2l8EAj82CAE4CVGQSCc/497TPn4OUjvNWXfFtFxkfph198CDu2HUxA+29hu6HTsaIIws9jeyDaDHzHLkeuYASsB+IhNeXHLLY2BxPHr17ClxJJ2AwT9R+x8PhACcpCgkEM8bMx+eWGaGu2c9Ms+is7Pznxk9l8+H1LYfrbzujn0UoEUhkZ1sI67BNoCLVqzlT1rUWZw1WNjNaaPf33bKGNi+YUqvX+d1xnRMir+MFSsKzoAfOES6p/iL2v/YIQTgpEXBQFdWLpzafcNKuODKt7em9y+g1PbEFe/dCvDgKy98ZjftRYORInZjatA8F04+Kwircz8d2eRwx8OvLY1LhO/n3NUve0c31GPkA6lgIgothoAfM515QRT/Y45oSx0XZGxU1qGuMhY0xB2DaMIqKl04eOCeUye/POHOjh3f++eFW76cE8XHb+xcc+v8tA7nT+gy4N0r9q92Ec8hNtCV/HrO5qIVC9hIesB0ua3+0QmzPj7jbHC53rju23mRxOE4JiHBVXQc4hUKWFbH+EM+Z5POflH8jzFCAI4LZlIYiiNgUXKRwH5WYCIRjloEHLQijznT89fc8L7ReN/sPqe+fn2J/Z+19/W4+cMRl3Vs9+yqebd/+3oEOnbSE009dvpo9vM30QFTJGNnN0POeuLj5CTYtX7OpN07WyDjPEYZyEgZeaRjR1vHgGo4NkpF8T/mCAE4LliIZYh3iW5/yuhHB75nMZsII+GoWwJOIongzwU5a6+Z32HgmCt6DHh60qr1Rtt7lx/4+8qXtVz1WtqQ966rtEexhp4U1XEWhSTe5kDA/r9MARVMfvjWxwC+fGvBFB1pmHEdkx6kihELBwGzxwYQ+C6bcwXC/y7CBnBc0OCgmNKAn3IO4+ASXuB+OpJBPkcbSENBpgX5e14a9N0sSO38xrqrpuVQws+vPDU0Yx+cPunxrWkDd7ADVx0NdpVYNrORuFrFTAIOEhH/4pJb3Vb/q2ZPiTmGVn8VI2b24+LoW0OCpiMEoBmQsbEfO5fwAvfRkUPkw1GKgEocrXj2tmnXWJwwfdb/zSvVZbJj9TM9Vi+E9A7PrBkzbQe/YtAEuo5MOIsprTWZV4OZvZw2+v1tp46BbRsm9/7942Nl9Xen2oCFgyj1rEEkOJ4IAWgmfEXgfo8IHF1LQMFIFxbNvaz71vVw3pXvb00dsIMcy6yJC6eDlltn3TJ/I3uzDLU60irR/F1j9h+4rf653P7IK0vjkuDbOXf1y9ne9ZhZ/d21v5X9uERkn2ZDCEAzUiUC431E4GhaAgrQgwO7ru+/6G3o0HHu2vG37Cefha88e0r2Pjjr8sfXZJ1ZmO1/lIoRJz8g+ZnYJDRsx5gwa8m0R8Hleu3qV24x0fqIFhoLjLvxfwBFFP9mRAhAMxOoO3A0LQEn6eh4evJL17kUDQ++8cTH6LP4e9WTPZYvhA4Db/slPKbmMSb+JMfPWVjGzhavr/+u9fd2WzqvxTH19a8y/Ynav3kRAhAEHNuWgJNoWvHth1N6bd8M51zx7uY+/fZx2PLexA+nOzASFu67t0o0+Swmyi89hRxm8iPv/pScBF+9+VD/7F2px9TXv6r2F8W/uRECECTI2DhwjFoCChrakbn1tt5fvQ+tO89ed+0te8ni51eeGZqxD0BxVV9X5Xef2X9uq394wktLbnsULI7Hrpo9NZrEY1pMRe0fPAgBCCKOZUtAoSXRvHLDMzc7gDvfeHpekbyHrauf7b7qC2iRGEk00UTRjl387J3957b6Dx/9/laP1b/XsbX6g6j9gwshAEHGsWsJuIikEz+8c0vvvVvh3Cvn/9uyz0YyrO9dOu+1fbZcDpHBAf7mD3Qe7wAd2eRx+yMvL41LgkVzpvfL2XEsrf5QVfxF7R8sCE/AIMTdEjBxCWfyq8dj8EjchhWgK3s339tr+ofDr+rc9fMNj05e+LaGt+/IooRw7MQThUwqChIathKf8OzcEWPB6Zp13TfzYkg4Il9/GQsS+gDtBtH4DzZECyBI8fcTaEflERYYJ6lIyltXf3ILaHnirWc+zNM4iSKaROLpziAcqFVW/9GfbRsxFnavn9H9x3ktiT4Cq78GJ7uxEoOEttbHiFU0/oMKIQBBTJUITOQlWh/xKnguIknklzmPDcjeBRdf8+Gmbn109KItXYhHRUamkEwmP/Le0uRE+HrOQ/2zdrY+Aqu/Bic7yOVKFtIVJ1G1Pom4TtgiKoLGIAQgyHHbBIzEHYULjoqGVErX3dZrwWfQoft7Gy65eQ9ZODzn3E9YwktLbn8UzK7Hr559y5FY/TW42E02l/AtsxlABYpnPUHfD2jRiOIfRAgBOAmQsWA/ylelkIZku/uyp24HmPHWkx8o8j6MmNnDaaPf2zpsDOzZfFev3+Z1xtjkul+mnErG8x0fMMSzTUIN+BEEE0IATjqO1EHIQSJt+fD1GwZn7Ydx1360pUOfvyhj+sPPL41PgqXvPNq7cFuXIyikEqUUM5p7Gd7cD0fQRIQAnFSoyGiO+KW50NOR9Wumdv/9c+jcbeGG86fc8f6Dj4FTeef6t2420eqIOhrlhHMVvbE39+MRNBkxDHhSoaWCA8QesQSoqKSiWP5vwqbpd7yk5/E5AAc3fzhpx9YUTNgacQ4JByU4cKGgwYCGRC4lnFKcYlLvSYcQgJMKGSfFmElBe8RdAYUY4lnw8ta/H1qQlgY/vbPoZoUWOBrs+UuoFGEjkdOJpoRiSnAQxbloKPKsQyA4uRACcFLhHrRzcIhUjEccTExFphs7V97b47oPy9YserYVeiobPEpHNi76MICBtKGCLRhxYkNC28S1BwXBgxCAkxAZOzvRkIrtiK3qTjqQW/7h+EjaQ4MOPxIqWQziXAZ5tuRQSBQSMlCBLCL2naQIATgpMQB7UUg9iqLnIIIUDCiNqL1VrEhMoLt3i+QZ5lM42mBmguZEjAKclKgYkdjBYWLRHuexdRWFchJoT3lz37bgmCNaACcpCgZkDqEhvQHbvdv/To98REKhosFFIhEUHve1fwUnHiEAJy0qOhzsoIIuNUbgZST0aIBwnJjRYsNKOBrK0BHWpGuoQCtAFb38/yRCAE5iVLTI5GOhIzFEkkAWJoxYMWDGRiWVqBwmGR2xuHDSg1IsRKI0agRBRSaCeEARLrz/UYQAnOTIqBSxjtMp4yCH2I2JUrRUYsGFBQ0uKmlDLKU4uYw1zENLAq4GJuVIKNiJJx0LDmHm+88iBOCkRyIMhZ/IwOYJ3qHFhRYNOoyo2AhHiwsdDuxosRDPEH7DWE+xllBwkUgSVlH8/9MIAfgPoGIgG4Voag7J+dfxEi5cQBTJRBJHLkb0yGixofGbBeCijGTScGITA0X/aYQA/CdQMaBrZE0t4cSKgxg0ZGIkHokwnISjwYYNGRsWkkjAjlMU//84QgBCFAkL0azCiMKfWAknAYUEHCQSRitMgFM0/v/zCAEIWSQchKFDRyn5aNgJaFFxMYaeFDXKQ1BwsiMEIKRRcXsVGjF6fkuUYEc+pisBCIIX0cUT+OCu84/lImCC4EYIgEAQwggBEAhCGGEDCBEkJCowk0MemVRQflSLkB8pMk6sAT0QFaASLWEea0RNTJ6px4JjywkWAAVTvbPSbORQTh7lOHCQj5FKKnBS08HlWGZdBxrvRBcnMmYsjYiPAzasKLgC3o0Dmag67lSDvpFXqEKHghOlnuk4DTXkNFRQQcukxNMv7ZoW3b3CtD/lj5z94XWIgA4Z9bjIg51I2gbMdE4qaPvRttn7/k4K+NQK6dmkRcpcVHIY+IF/2UIHrDjZzWIiGnm8ioX+DGAdOs6kM0swEk8k/0aMT0nTutR3y1tnDeRv9pNCFOF8yygSeBoLRsroz0DKfM5WQkce9vl9iGXEoAIGKviWSvSAShz5LCPScwdhhHneeSbnsNDn+MOMwuGd1uV2/NYAZnrQHRUzrTudflp+2t7wy4rXb/nsr+zCdsB2FLZh9rtP/3dxvTeoO8B9FDXx/Q7nKu/3HL879jzUcMqxB8gAMgp5xJDU+YyhvQa2T0tKSTAp6k2lmv3sdP198E+z1VBjMmqNTNKHW7zf7dxHRY0L3E4P7/clfO17nigivF5wDjSRafclGm2NmPkabUzZoZtjDFj4orGxB0fArJxH+gUdLyrKa/xj1UhaXeSbup3GOvcwUlSPrOo4QFz0tCdHXB9lgtEAnMmG75Y/tWR1Gppa+5vrOtHNDPB+X8O7Nf5N5EmfX4+TUfsEFmLoFTDweCGdu/W+ep055++IAP+qWEkIkNKqB8TTxPhvMjnaVF5YVL5PXV+65zCpR9HXlbBSgCm29wW9zmjZP6xFeLwWeNKhzS7bbVylXXJwpZmOfnJpoJRNlPhcswhHK56tfrDGigN3GdACOsyUYEEHqKhabWSr4hgUwEkUkZ7Kz0BMGx6ovoKrVJ5hUg24p2tLlHmuLyGxj8EDRj0+YEyVXLblzIqfP/jtiV15gUTdvyxexQifX882WQCGcpP3u1JbACR0fIaVWL9XLAEZxHPK1YOvaz/CN5MPgFOhLwNzn7zz509TvNstQLy/IPTyuTI8UUsAptLF5569AqCikkQ8Fs9vO9ro3g+YGnm7XbKMcyICZssEingLTcBatIgt2Vddm9LQyWuQuMKwM7KO/7Q4qaizeEjs5MJeLy9u08p3q4Eh5w85X37k8/8rq1E4wljPYJIprZ36axnq/d61lgAk+L2DDwIJgIREeQABkDnIlTfDeRfOnlpOeMD7yEFTV7tEw701N0XSla6AhU6bOi48+O6evNi6BaROZJxkcUrqkJmXXREf6/c+dKTFpqWPHPHQxjX/vrplfpHPUzRxADPxlHu3yWwp2XNFB+8eSWR/v/zXdBRkFMo8PheFDDv1zlm39dSgBezEEI8DkKjg7Om+T3flrxY1Bfd8TZUi7Ghw+3juYsZNU972L9axERNuO/fKB67+9PvUWs/Pf0//V9b0EPG+grGz5p8KafzJ95j8Xr976avhF93wRMdudZ22ZfLlrXS09ElYGZX+t+Lb3jIHiFyx30cAcvz/cuLwHuAEp9Vqqruq9cO2X63DXcaOkRicARu7kfy79vGb/vdO0x6ts6LuPrCWQ5TWUWwkzHRIW7hWFzBi9z2P9Wn72HUVfvdgpIjVXE5p7d0P+QjAoQA37YuFAOgoJzdAbWxDls64BpJS+p/z2eJWAdoA+aznArSBu0Eqh2lFQEx06t2pd9mDP73408M5NA0N5RzilltveS6+njqhz6A+n2y6YcvN2XsTPVsUdNhIpD1WzxaZPZW/z+jwXPVR46Z89Ws0Ki709ESPE5m9XDiyX4/Ivis2pABOyj1BWKzYGHqF7zW/vtXk6TQYsFPmGbiVKeTaq299O1Aqw2Nf/S75poffrZkjT6ANQIPEh4De+xJlnBRSyMxZF0yr70gVw6ZJ3mwjYWAVO4kkeHFhJJ7cgOG6JFJ45t3zpvTtf2yupcXMIRx1WBUcwJIlujoD9o+61qqcf0PN8voH3ejop6rHBhVDgPDhMgVccGF8DMAFU79cbArw1KIxY/ax1jSNqLBL/jfg/Lsude5RGx0ZSaKYAmbPu+jKhvftfea8rb9evGVx1Z3pKSCDwcjeCqI1/3x43XPVbZARF7WKKKiIRsXOPmRU7JjpdznceF3Ohs4oKJgw4UIik1FjW8ZXX23fxvztPdDitv2sR/Ksx5DJkLQXPqo7lQ+8s8/y3if+206YAKgksoWVRGHwblNQaM/NiweNbehVvJi9k3jvmaz0J61JZrQTj4RMYR0TdGTM3Dhh3d5jcyU7Os6uw3lHIotREzp0q+/4865//vArDyf7HVVIPp2Pw1Oxk0BsraalAtzsqQLOPW9kYnZ+bK0jE9FTTMpRrD7Ups/7m7KG/b0hNsB/tZ+djI08Pvx2wPmNO3u84dIfcs7b/0NLT5yFODIpxeCdT6GSkz9hyZnenB6hvWLim+/F40RDAjIq2Zw6oE0HOOvKz+5QVRMGsvgXA3CAGVN8rzXvzWzCUQANdlyY0OD24pzxdP2pfPfjgr2s9t1yAlsAJn7CSrr3t0QBBn5c1HpsQ0c6bTdmm31WndGwnSwa21NvCB0GnwyglcIb2QEAU4SMpo6epYs40rHU8YCjWb/vrWcm39f4VBr1mjqs4AoS9jrqNRc2Lr3Zd8vab4q30HH0ZdVb8g/pfr6sRgdCRXPEy5HXjYoeFwW1UlpEaqvuI6t+DbrmhRe61CqSCofJom0t405TiAlbtfKMTn9khNU6ewRav20SVuDl9xpb/N3c9P2irr/sSPXcn50y+lJlvJYwsvyNM33y+oibn3pPg4TG8/YOMf0mgOjYFud99l17LLTmFGxU0D1m2HnVx7mcKz8JowR3JbMPBwYcQBntIsdMqN7P4VzxnpKnP23Y6dXbVn8r1bDMnDABCCOT1bTE18Zr5slHW19Qe98Sm5RlLtdrw6IcraIkKHF8XZTorUtVtECjS2mDVKLzhtV0oFFzzLGeHKKgcYbrJG8lrpKjhCuSpy8iyYVlTo/5JRAGHOTVkU4ZmHb/BVe18Ou5ZhwyhGn1AXv6UonZXod13kYYXXAGFAAnCbq4nt70q/OmLH27PbtZ8dgVCzr1Adi2+d7T2paa/CL+ujAQdRxiAEoQQKpkSrn+xmq7wPgpr7yQ6dNOrDo2nz2MbPgi2FSLQ6NVXBpd7SE/yfj+LwM6Gak50mBF8XuPErlMu+SK62ufvfjwlp1x2RWGqA6p3aJqdKyMLPwpIS2TcM/ZnfxLnLfNYubDH6YUpnib8oMHjWu/fW+ix7/BTCvtqZPc/1x+84bv2qChjJ1o2c+dVxp8zCZLv8yu6OCZxWFnKgkeS0MlKX1N3vKcVzDt9MRtrdjGikvu+MSoB3j37Scnt69xPydMAOL5hn9J8NoJZXIZ3vnWR2ru99dnlQuXrRqaHUMyedL36YN7tx1fnpgrFahVSVVxkUpio9axawgZ2Ojz24WcL3WN0dgUd38135kw5n6vtVu1/zx0eV66xv16o7VbK4uw1jleLuMius5/W5DNnZd/ttx32w8LZ947JEbCVtPrQdJIW8tLKAxwHolibuEVDgYUABU1KiG66tehzDve7k5HurF/xwsDn94S3+XnvyaO7GVvXcMuqtYqfscGLaUU1cpydmyMuqH6d5v25w9Zv7plrfuJR1/3AKUPXz6wem6CrszVzxTXkbN7XtYqyfffdh1ffGTyY8k+Z5eQKKnRVisl2vDc3JpnXvfZh293+eNHVycOE063Vj0v6HhP23a+e8S1fvnRBx7t5mlNKMjovVaAGHay6KPJd1XvfeqNX99fgYY0dBRw4bhEj2INPlcTu6LYRAtaYCOOU3xHV/j8zYOevF9GFJ/7tt2q7eSs+mzDtgmoDOSTL3buf/8fmP/cTTOHElfrnZwQJGTWY8fuffAu7Dz2nv9eu7Y9f0PU6h44kIggDFU1H8g68MWi7nyhKXRVHRlBEe9Rdswyqa8rj4Lish6yYkNFj8LvdN5RvaesTFxfzDpaowJGbKj1TJp1EkVSPfVoLN//+eOCMZdXb7l26pOP/lQyGEMNbzkJbZ2OQFYMdGZpHSO2Lly2i5wGz6OKi2sbubG8kMnE8Kpzx4R597x4TTEdavTJXRgwHLcYwDW7TBI5nH16m9a+2y6+5Z/VxloCEEU2RegaHJyq3GfNsmJBIX/3lsVvPXj1Exfd4fv/VY8++camgkTv+d3vz7dDKQEP3R/m18e0Vv7vUs2Sg3QllVhcSMiHd8x56t2bZl9xo+9+tz+86OXc0qqBbgUTaR45kIhk49v4CMC517x3fyQaDmInh4GTq7bL0kVXzn+9Iw6s5DOkW59e1cfsy/jr9/ae7rCTPpRT7LmWC72tWgFa983kBTryKJ35YF3SXdelL58pEVtrgOwECYBMKbmEe9VKIpexfYef6rvPLytuGNHZeR7RGNCgoqLBSDRx6MFVNaCiEsVa8olvWgLqwTdDupAxYEDFgJ41ZHKKr2RKhqQ78t70SIAePVI9S2JqKaOoHn86HQ7OmbS7f/tOVVuM4Z8tPXXYTtoTh+rzqiQ0aJGRA4xvOjiFMr6royPipLJi5IFYz4I+keHvfDNlZBf0/ITCn1vWXZOCNoBZ7VhZV2piI5HUWv1vHbfUGAMaOEE7ZYc5rNbRRRST1qAAGKKNGDCixUBLdlR8cWeHnT1n+76X6ffeOtN3pMFKW1p5h+zAiqy9+W7fc1ptEwbYdoyjAK3HF0FGRxJJjqtuyiyfOb16T0kac9vDT7Tx3KWNKNLQeN5bW/bs3La+W7+qfVNbDDhj8W/JdMLCwOSzz6o+y9ib3np9Lwa07GGSn8CseT+Wjp60t8fBHd6p26WkbakeAex3yqMz7382nWz+Bf54uQupmALI+gmaDGQkBxttSfZ8Eoli6u2+e5QXjj8z29kDXa1EujO+FiMGDMSRwdpGO3QeGVXFfzdRAR7QFPqT0aCjrBYr5Vjr+ZTiIEVj9St/p5w6dUIJGRwEwn16yxIyZkqxYvH7mAE7u8giI+Anh3/586fq8/c/88VvNGRSQQ9aEYUWBcnv48LgM1B7bJ+qDrBi9/vkkRI99GL/PaMNIy/bTzmlfh8LGWTW4e1QGwU9Wpx0RuayOe8+6/vf5Tf1l2No6f0kk04XOno/CUy8MMoviz140bId0cSg85EvlTBUVO67a/Ua330nXp+GnmiiiSYF+JN1rGc969nAOha+6bvvmZPtaNjNCnpc6ZujOvXs3K2IGFIZysSrq7e7+OhdOzmezyGcRKBBjx490eTuOezjfXPfM/fcmksB5YQTQ2INM2d1Pj0hyFiIJ8lbT9loJZ8yznePO68rtUeymHuIwoVCOK04RAk2LDjQYsGFBOjYSAnJx3FiiIoB1VP8KwL2rKfwJut8fIsD3a+VcuqbsyBTSiSbNiV299/+7Lvff1XqLGUbUbTERBZWtEhkksh19MJco3NgZA2ZtKpz1R49O1/Dp4Y6bVzcotfHHeL/2MdBKlEIJ9rbClCRjls0AC1WCmoIqkwG91ylr9V8mXTL2vdb1Hp6JWh96un60VGMkSR+4w8quem+0y/r6B2Aiosdc/qvv1X5YspYkSjxaVmU0M5Pkr7/6aUlBj6ngtZeo65COBby6EEFr149xKejmN52eM+NW6oajjGYifD6g8Szdr7tDYN3OOf8i2dFVFSkoGP8Dfgx8YYn7y5jFePPifFp7K77Y2tmitcSIpPBIW81IbObt194zMfB7PnXPwj/+dlKLqYVh7AAplqtuxMkAHZ0jPBZ076S5IG+rpV7ty/9rjdayviBa4mhDWbeogUDSCGBWMr5H5uJR8FOf9pQ0WANfKS4a//l7CGqnmtM4U321PG/hIqZUuoPrGEH3vmwZvGHyMhnXr9iagwuSpDR0ZvWWDEzknF0prKWIEXQltfIJq6Oa0Wy7MCAWeNurd7S44Kpf84blWvT8wKD6c0y1nsFwEY05yIfxWh73TgJI6KGzUTFwdlTau/btX/nzjt3JtfYaiUfqZHTlMLZQyIyK9DRlv3M+b+XfCxOp4wq+K1quE6DymYOeoeZ7ah08uucvvUoJGHnF3pxNjpUFKIpJ5NuJONk985Ny3qPqt5/4IiMLVW9cT3FbPYZYzhYuejLCd5BWIOu32VvvRvPsL6du/qnf/jVOXfHMJirJvtu/XFOgtemABHs4m/CfErVU+/ecH+aj1nyumei4hbMjKWMx+hENJtqDSWfIAEwUMhOorzZN4e2A33//+J9mWhUjKwmmTbM51cKeZcelHI+WrZxmH2UAaUYaHeE69w1jIoOHWsaKP4AU1jI+wEnNkEUCbSs93iZ3YwbNvGaQP9NmvLRqyt3tEEhh3ZMJ5ZKwEQpOwNYHFTSOZU7CSOyDgko5ubbuo7u1Kl6S59hqzZ+d9bPmTkk04Ifa+zfmjPJOg59QxeaGjM4JHIZ3bt390B795/y9XRnjTsqYRf2RrZQJAw42MowYlDoxv5Py2ZHee3GKX1zcXjuUcJMMv29o0pWItIS06rPtC8ja9VwTEg4yWEvVjToKeVfNJgoQyKL7+f6CsCgvhnEe96UDge7KPLM3JPQ8fXsCT5eGDfevOTdA5x1Y830t0q4dez7S8LiBvt4AFSW7/yyk08dbiKNLVT342MoYfz5q7b65snxM95pufKqHPJJQ8/+5hIALTYy8I5HcRCr3/DJ1uVRuK3dHdjGVrai0gctZVjRISMRRSwxQBQZ7KcdJcelDSCjZT3ZdU7l9WUCG1lK7WZ+lVGmvuPt6Pm/WXX9+9onvfoXE45Kd6I46N0eyNAnkcn5ZPICZiICFg0TeVw54pftkdWPn95dem9cPbJkkwMrBp8lQiTKWEFfTMdkkNUfLTYya6R9NzdMDbz36Gsemb67RoPVwibySWyUM5CKjIUkUjz3lmfOXNNteNW/hjZlSJ7nKWMnh/3e95XFqPa+192/PJw0VEAikW0coC9wmFbewqPDtsrl83bsbZZ4rwsyyT6/ktnzZ3ZGC++oR7eBKfFRhRf5jAV5/7mhfMnEy2UfJV44f6mzjU++0mDHgNPnyjr+2bbg0qs+9z3PjVeOSRk3VnGGoxB+LATAiL1RK8v5kkcfzvQxLdlI9mnfVdp77e2ICVBJ5g++J51Sz3p0Ek6/ZGpQ2Eab49RTlbFRjrGR9/ckFwZYX2c7t1Du090JRA6j+nXqXf372vMvunjcdVW/Ove7bsJbC1MooTEz2JzkcC9ansEeUAJUtBRkzxt641q9rwUtfu4/d47duqzmQiKRHGYdo45LG6DmioSltNZd4DPJJWNzbGqEp/OcEjt23HuLUv2OlzjI/kZ7A6posVDpmSd3gB3bqwUgLf4Zvc5eFQFRZh4HvIZlLbF+ngPy3rE+o+da2mLjABpivflZR3FmXlEL704tk6YS4X3/sfzN71T1d8Mp5Yd3bvy/6vOPOGvvXzEB/JPHnttR7u3nJbtmjnt8yPdt2dnrs9yrgXCe+iLz5vv9JgSljpqz7vIztxUGGt1pkgBY2EYYGUQ2uQFuph1t/TdFVX8tKS2rdHtPyVjJ9Z5f9UwcVWvc9AH20T7QdFX3Hqpa7l//qqiNXtlaaoJ/gcSgAFutdGxg/rlKBlOqIyfw16KPvl/+d7UAwHNvL/i8WE2gq4/nRN2psLGHO4FnqPCTgOrecgqV278YPO6v8Jjq4+K0c39+5uLXvvbvU0toWMUAjA3YAVRHzUm9akV9KdVgoaCGt10Gky+N9LG233vJ5KfPGF/168pbVy1qW+M9FtQRgCXwc9FQTIZn0lgpDp8IDJFRAyN9/ao6ofG2T5No7Vcq1hR8TBvvL4VoMilC77NqggXJendltUpEGnv75KKWZLOZqmnjEgV8+J6vAFx4Z951BCDC+L9PWvpksM07ft6U4OexCQp2ZB9Z1aOwgwfeSVBu8pusPajXX+vGDNycX3sMpQkCoPILvxFDBF055NOfbwxarLj8aifZUZ0ZtNokOQKQiOFH1pOIgoILGxpsgAtJdimq16HCyVbS6mwDSJI9wmHzzWpW1BM450HHcFo0sE8negyr/rX0/kGsyZ/zyNTHqrZERb/61HX3tySFQmxV77eeZomVrUzFzmtU+LWWLDjR4cRJApatM3vf+0d6G9/j7vtq89gFP/qOuKtEcZi1jCS33jaMqrP6NSedaMLr21/BUDNmB1FcUB3Ghaz9v+7u/We1AJwyqmeLjOyEGs82j0ZrORJlFHv2L8bsk1zF6XBWdd5kVFw+gl3zLtL0I6lurmqoII0dflO97dhlySfDKYrFx9iZS1u6U+gdwIxjT9Zvv51xRtXevQfXlf7zLvP9tfjNYiJrjIJYiESlxBN5wokOIxFY2P3e4vJzPvPds0X6T+v79cwqqek/0+iC4WQDlbREJo7OHGjishERZLHHR/+L6FtUbfuJiwmLrzQbPLFXYolCxUlsh34/aSXFBZIkaxOvMiyvmgCsQ8JSx7gmRJiG/ONyyj4e/Ioa05ITxh+sIrbePSqINSZ0rPq1dc/S7WFE8tD/nXNjurdveO19D76yKbcPsQNsX3oc/TVYGB7QHxh3AXuRYhb7xU2IwsABsnEg04Zlh87sO3/pYL9my7wlu9P/OeRrQJSAjZxS19x7D60viNolVz9kFFWrr29+hhMjLX3OKFHAqDa+rmA/znfx2aKZr1QXxb43Lnq8k5/qFRHBOY3wBgT3rNFTOM3TkTxEB5/+RGHJb+Umr5lOw89s87YADjOm0ncGcEqquxUKIHOYZJ7gF96mNXrPU7MSFhvrU7Jyyj71GgHdrsYdaektahImNrxZLQCNQ2HV3M61HHllHLi84UAUSrBQBnTmn4Uf5M3+MdGnOZuc+ufP/QfWLDONFAAHq3AQgYpEOe1ozeEmtQESWcL7PjVAFncdrhYAnbSt+6qMVFS0OElEC+gxhSX59Boi4rTeMVjJz0mmJpIU36ZpD/fYso+8Bh5rGaaWWq9JTvn3NOIoZSN3TfxyZfVe898bcd5h0sIjfSzS9c+BymcXXXwMZ8X0owc/Y6A1mYTRj09LHhv8wpfdfEa5NXz03cDeRr8TR2Amm+R6J1wbI4wdaQJabH6DtzK7udJvnuJH83TEHNi9prNXoMbd+NzjxfjOuHFxmDLiGhmrRkOBx0TmxEp7n/gLmXn/p0R6G+UV9Odm792W0inTt1uk6f8Z6bidsQrQMgJwkYOWIgyoSGQxrGuUT1HLz/6VWG+bQkUl1q/uDuPHr64sS4qqnWKrrbCkVTIBWLOopLjmA5dxUkl3tKgoOBhIEatIZSdWevLI7+G9316qr55+S7sBjz52Z43ZN40SACerKCfBEzTCSSTdyGhSF0BFIsan269QtM33//5jv/wxFhUnxZ6QlAoup+LTMHNaVW/94TqObkBHT3+0DTgqW4kMq85g7ew3oWUPO/hm1aJ547y2gdPPHTb0/FVPSz5R1iwWa92Oxy6eIoOOPhnNTjn5WEmiA5tZT3c6ksbk8ePfvNNndLlbr9sve+9T3yg8EiXkcywbTTJOCvxG8M1EcLFP3/fgv7E7x1DGyrnVAtAubcrwv/70nRbkQqGShEZcUSUCM/9QQRgSWXRok1QdE4qiXVEkeIcBjUT5+HyGUby70hHh7TAMGtImIqciAYkcWjCZDOAwQ+jL56SgA+wMOdv32sU7O1Ed8k1GYleNUavDzr8+uTjA+MfqlS/PWLQ20P28OXuT1+u/6i3ZiSANO1bcMwPtGDBwPoks4ia6oe68ve8Nvw7sU33M7Q9//QZ+0SgbIQDu4l9d30uU0540MpvQBrCTgBaHTydg40rf7HD2NXffsYJoHHQHKo/hZN8Tz1oWkFbvHqW0KrrVq27r4++hEy6MWLnmpqzxYd4u+byP27bf7DN4d7hoVnFYQPOiShQl/EHbOiYMVRLNb1hRScDI9CmnVfTz8XW/7O7vPg33eRsSNHIcpLE40dMDfPLQIU4fk+wTGPG3uSoqB1j06VWzqjPlKbd+/WesnzTlk0enGqaw2sg4yCKKQewgjwjKuW66b1bfs8bgjUwpYaCQDV7bgovS0os2Rnj9VIy60ZOffNFMCbFMJZUNgEwxrUhnHdE4sXKG3zj+jtXFfs7qMimeqL1VdyGz7M1AArB72eJ/dm3rVCuAy+G89T918iusKhBDOLLPG3dhx0EeCj9jIIyObCkeOvDPlUMHVl/5vqk85nvmBgXAySrKiPKrc53o6MqhJmQRC8n09/GHUinMOPRvutebNi767sfueaScyzmXxeypNSH2ZOISdCTVu4cdOdeWb/I09XoP6qrFGUUcUGL73w0vLqjar027q89p27P6uIJDPyqxAV6ZigYoILzOuEAKVqKxE46WBCQG3fN1m/O95rZuA65NKCvwFV0ZMyUBA5odGW4X42pRUVEZd4vv/78tKMOKgX8KV/58mndazGkXJ0ceLvc1UpZz2Dshpy4kbMSTRRmtiGIPa+mScMmtvnssXZLrbSlJODCQ5B31kMhg2bKbfBzV7nrogxezSGU8rclCi1siHRioYDV2Zt6e6CNlTnXbL8l+bymcrez082lwsGHzrdu61Sro/8w3MvetJ16tuX3FByY6+xvRsaOgwVIrYL4LJxKrkLCSist56rDD+6rjTrQf2yQBcLC6VvHHYwdoShvARRjFZHp1UWIf38+d5hMk8e6Hv1v07/rRlNCSvixogq032MhjHckNPJc81+n/DvcIQFSkZdLCuZBCOGZe+vTiaad6Rwg++qHSJ1hf+T+DAjbMJTTspaLO4l+OGUPbkv0qsaxjBSourp50ID/a0yfTYe6+5Q/fhrULLa2OYStAi5UDPimqICG+r0+0nbUrfs9sSyHFFPLpR9UCYND2vfLFOe197quYTVxSrxeIhIMyxhPOzyQQTQ92MneJ1qfhtHHr4h1xPt4EVtr42JRUItn4CfdX7x8X8+Fnoyd2JYFCn+KmUM65rKdlp6f8CuwfP/1dnO4XT1GLkwS/oiZRyMK3Hq1R0LctzzjQnu/ef+ClsBruH3++3bJWUZWowObXHpTQkIUjUg1TcxMoZQV5JFBgn3nj3CVV+3SskYHqFYCqxr8S4J/IJrUBXESjI89nfy0/v3vLc77q9cUfD56x7Z9oVNoSRckRL0/tcq1e5rSYNN4XqpYr/U6JTzqikx0BEeQ2mPZDbFw63Bve5uVnls21cDMqL2Hn9svX+YRtCvepOP5YvDNg41fFRQ6aAIZRGRcH6dZi4vvxoz5LXFkSxkjuYzUFFNh/X1Rtb0iLVXwdM5BwUVGvpSXn8OY10drq/SudpughZ9a1t0QlVm/7T+IQl13j2+JYODcPlVhOx4Lla5vN4DWpXTF11hyzXzbdQ67HPTowDsyMoAvL0eBiO/GaH74cOMB3jz+e6Us7793JOLAg+XQ79azYunldLx+j4VkT3s14+p5UuvuYH2VsbGRslzf/9O+U/fKyvkaxUkigZoCTeLbOc72i8csmc2avZjBZFX99MXqi7/YNf3+xL87vnAo2WhHviT/oRoOZ/Zx+6hULS8rndskgkstozY/EUPljbl5yVf6v4d5RjwCUHfqbMqJ8orDYsHuzdiGtSCWnkdMzFbT0JYvqVV/S2V686MULfXqiCRFvrF06449XDjtyyKKAkv2uI/JUdlr/HrOOcPSea5WSQIev4i86glMdET1JQIe+3n2S+G3ubd72T8sWH3714MXh9ORK1rA+876Hnnmi9jEFxa/9ZGdPre0yZcSQRO0FPUrJx8QVN1//fGIUzF543ehUJC7iDJ4niwifErjHttnPcOkgklYeX8zAlCxZdFOpZ+hMwoaZU8MHVgT2W1Rx0o0wn152OpN8pgC5lH8WtkFPJBFEsdO8etHp3th2PXte13PjlmrDuAs7JfWaAcuyutKeMrLYSzRDL7ntiZZ+8U1LDv/1cR8fHwYJDWvJ8WmiS+xn1sy3l/kedcPd7bv9NDNzi0wJUEkhBVRwys33ve7/qjN3bF16Wg07jZFDHKph15L5u3jxN+f75Mr8st+/SEHBxPev+QvAb7NTaOdnCXGvLFXsty2LtmFXPXPebdCKR2979fVW6DmHMl5A4QEfpxv/p1VPCcu4W1fQVqquBfRapSLqC52zKsppHH1Y3Mi5WRIyOv7y8UWWKOb2B0beFOlT8Wg597lu0/Yssqztv8+hjhjUiBMHwCENj0kpWY8RPQplDKYnxuMT4yogLelHVo3FT2rSmgO5K+ZXxYCD8y+K/P6XG7bkZnInB3jkyTNGnD2q5jGzny5QUgIY+Urpw2AsAa5XTNeBVz/XboT711ln/friU3f/Qj5JHKRN39MvrN7z4KGDfusAWIltoAsQYbyEDWQSjYwVO6Npl2CvI5SIghEJq9eRK4t+A9N9xrTWLtWUDEVPARvQc4Af5p7uE9zytCnLplVXMyrlFNCrnpDlwy9R4pBt8sjoHt2HD29TK7jxHdctob2f34ML1RvHr+r9fPrLrb/18hurHzH29LH/Ljr0Y+m/lLWie4fOg584v33Xmmd/4PrVfmd3Y0OpNZHZwY9zfAVg9ScmVxcKMbBq5d4D7dtUbS+zvrmw3C9seyW9ubiGQ3QFcVdc/kyqx9fh3teSMh78Zi9gIJPLHoz3qrvV7i9E9QhAtxdqFu1y1O+qBAASMKM2eg25EvqSxE6fZUFkiu03jvvsN//92qa3vR0uaNQ5A6NQru2ChrWAhbYMpQTbCbQpykTxMR3qFQCJPGbcsWJS9ZYR5w7dvfy1HYvs2x60tpRXfF1TAErynn8+DDnAGIBKS1r69U59UpJQVfwBOt11Q3vr02VbKvWXXHz3LNlbCeYV6nac4uem6yQSqV5HIKusMJw/ycKAnaG0oazOvKTByWGfEYA93OoXA2jph7mEI1NOJTZMLF1yb0liTNW/Z1391B2HnNU+IPls44x6xKn/tVwLrjpGYj56e+7PMtv9tjloT6JfETMRy20TFmeH+92TRM9xPcedC1xQRw6d98a8VeFsq7HVTDc61GqfxfLPz9m5LbyNm2Wz44BootnD8jfaP1+1/YfPMq2d/e5Wh5k1Pq7IAHnccXqqj6vTNV9nPxf+bsFha4uPbjp7ZvX2X9af65eKegSgdoZSC1XV1yvf0QQjkZV0LuRZP097mYW/97rjwVcbfZJGIeGinM6orKADQ3Ge8DGFYTzJwQam8UisLHjgqqfmVW8xRJ714KgHSwqLKm+Mrr3qyS0XW+gUsFcexUbWBbyGQvaS9p+O83EoHT5u+LiifK3hLD8nlPVfrHH5Ts50D/Qm12uIlTATwTCWk8FptKO4nn01WCj1SlclUcYRPk3ccssPixRykLFhQUZmn7L08yu97g8xEUMvXrCwjffeXRTgbNBAGfjpr//ppsn4TOOpOmMFB2s8W5nlBTPHzvqZJrD/r+m3UiumlQsd7UmuJQAye1n74QWewrl1y7x/o9lFFxKIZ+kHVz9fdQcb5wzAf62kGFbxW62rr7i14JJIHxfU+2aoM8oLxif4d0Y/+6DRAlAbRVF8zFtKk2zEMllcwgIyPKuiureZWPBaK921LzTieKl6JVu5gQLtloC2GIjDWU/c3uPFGPrxL0kNtAEieenjPj0mzPTfGhsfyIvooekLVkSRE/CMEk5PtKRazww7U244/bwYv/BWcYn+e7l463GdX/ZUsXsWnqgPGTNh9KcDrShroCVYhhmdxyk3i+mXxfi0Qxd9td7WgnIspDAaBYU8Mj7yXQlv6rTNC6vjA7UkgpIjmg365/fPnh9PUcDIeDUdn1Wi2bts2SWjvmjs2VevGn16ObGeQVlfNBwkO8BV83njrfNnuu/r8zcVklA5yG4kMgp/XXTWOIB9e9f93apGu89FMik1ulsS++y3XDpvmf+2qBrGkh1b5i31D3Z8AifJlNGNy3nWR0JUtHTmvRf/PfjYu+HRDRxu9G17KA2OBLuwkoq9GYo/wD1MqnO2YhVazEy8r8Jx/UMNne3D+997RYY6srwasGPgJoYc87Vnf7OivrO/cMs3h6OoXqZIooIkzmpEXEAZM3paNRis20m6129eJYKJt/j+u25eJxJRcWHAjIxCBGtW5BxO8Y5d9zytZdreQ1WC6mAf+aQ3celKO28+8dH/ehFX12SKALQg58snRl66oHMjRpD+mfvkNeUB54DYSSM14DOKJHv/1tU9hoDduWleX6KRyaIcHWHMn+UWgG/fqYpCXY2KniifURX3tlZ8/MvZ/3flw9SJgzsvqVnM/HNOA3Kg12up/ujQ1ggoqfE5m07nu68WLQZyuJy2fgVDRUMLVn3xbOev3q7brGNn60fbV+WS6fnsIxcDWjTVH7lmKnWeeLc6d1p97kyrkWj8x/fM6BtWk938wB8kk0gFGuR6PiqRwIL/PTEhP7fu81UUzbz0xWe6o4cmpLrqoyKxbeXnF9bdmP/g/56Yo6uRwRR60RKX7/NFg+z3FHVaLVr0gL3qDUu+jU13i01CQoOLcio8n70M6tHbx8mmqPjw0kF0pgv9SGYne9hHBhv4aYFvis6Zto9MDnOYw+SyjYPE+eUtXb2DLk62ffNc/1f+F0dck8KdqrTn51+ndlvzvqXe/fbun3nFy9ck4z9x3Y2Eu7PsDPCBCubOBvj+i/XlGsoowwG4SGL5sgOHwcrSD9sQV+OTQAxOXJ7p8lUfiURWPLLxmbrv5r0xW3al19jqX+TDqBdntCJV19+uGnOzVRSfDr4rSqlVY5XQmWt51G/ypYqGtlhyH5288/k+l6Se135gmM/LtKhZGw78sHe+focVp8eOqlJJOiafpasUFJ+pnk6tIvuXUwWXTyPYZWp810X1OzNSQwKwl6msJ5EY+rCOihq25ZoomGjNb5+XLU2fcf6NabUmgeTm//hxzlP/FqQF6G5JQBkuoj2j/1WBU2pfrz2bF33X54HZXU6p+c+B7CUzPv64gni/YmEnhj5U1np7Ki6fMV9XuP/7VZBk39g0qtcPw04k8Tg8j87MqAd9z/rTgi2090x2rMTqXUjrh3lX3lOdS0bd2/dxqULvSUcYlVi8V1dRJFeAiTUAWQWHN//zy/5FHbaWkoYpoFVDQsUGaAM8PSetMBd+dIPtlasmt7sgtXUts7iy7fe1C7Z+uMY5so52kJNwYimoQ3gM/Pm5fa6exbPt5KOikEIETiQO8Ns71z268/ey3C4BMl0YKttqRPdR0ZHOT/cv/vfaZ1qm1jxi4+rPp6ib2tRaP8JPAF57gDcCiFjVrppyy0Fr9Zr34ewnjzLv7zJWf/nebrNDBXTa4tJDtcbCVSIoJwpnrT5NJK1gz9Jnop6JSinpcGeHBC3AswfzdrTOUFDoih7Zk70U4rHyC3bvlc0c/tU5RnUpKmjkSsfBYn8rgY3VtySnOBwA0fpfdpUHWro+IKVs/P3tMXaX4o5W4qxj/Q1cxFBJBSphdMCEioY+bKSSsHolQAU6IpU9+9DqJ/uO7jsisVtkeqyh2Jp7QLtj9x+f/7yn8hLSOVSrMEoolJJOD9ZThg53MNNiXMTUMo8pJPPjpl9OPTBWHt9lWHQLxYTDVVq8Yfniee/Llm6srGW0imEvm2tluzJ092571ewA0OmyM3L9DLoqZKwdZZJdCmgll7RrZ6FHsIsYwjCvXPck583XPnSXRAmTdv7qQm9wTguVnpzh4OfNT57ewmh2AWhkKayPZPfO3lPIZI7PtR2Of0ZFhTn9bsOkWWG+KXdr1oJKlTSGkQt1WlCcpBLJfpxeOfV9emGksH7LwlvVO0YPzO6X2vG8FpIEWeaf9obtKl/5Y6aZnqTXaZR0EUF4nfaycPZYVy4YeOpPf7pD4kk4seECjHz9bv9z5j9Xl6ldh75WN1hFQwILP1n9+XXXdzgvuY8uFr2msjw3f8XfXy38Po3eATqRfgJwcFutEQwf9JST52OAM1GE3adSdFKadTirHAUwUEJegMUsSykl4PgCEnpSCKcwZ0+O4y/31v2Y6Y1ayydNphTJZ5sNXX7GUvfKOToqyatRVdtRNto9Ue7iKcLZ6Ih3DsoLMpba6mk4SoCLBLL4mJEMJIpsZMCCiT5sbLAVAE5MdMBk+X1R6aJCujGMv/ie8yjDSVvCA9RaEg4qOJVJWFmHHR1QTi8u5Xd2Y6R2kz6JJLKXLF5yGmtjciNk24QS1fE7NroHSJuWQg5goGaBqST339h/3R01A7kU+Qm8Chb5FxMOQI+TShyep2zzrGbgRkPmH1XOaDIRlHlmsLs92So8hdyBhszlLo/foxY7hT62Ixmnt0UB4FTlv6JquLhFsIUSIokliog64wi5C1wHWtEfK3+yB6mWCKioRJNAqat09aeru3MuEpDNfAbRlpQGwpTqsLOjHs/QXLInZUkZyGgBhQiPtcTBocOzBu/ByeGAx2kwYqtlblSRSCXLvuPNXW/qNUviMLQsH1GagY3wOlap8hOAOtpR3luBMh8BCMOIBo3PazEQ4ck2epyEBRAAU41Fr2omX8VIjLd94H4VaoD9tH6DLSpGInE3SbXIlNUQAC0RRHrqqwiM3raEOwu4sOE2rOhqXUtGT6TXgBUICRkjNuaTQ2ufICWSVwIaagVU3VEy8Z4MEEEi0YAx4NOScGCmC8PRc4CqSYXu+eDd+YD1hNe6ExWFSFoQRllJSYmMhkiSyUKpZT6UqKQrHdiHocZZHIR553LoqcRaUwCI9DSydTjReZ+yFplq0Vcw+sV1CEPneTMaXN75ohI6Ir1x9TTYKEHySave79pOIomsYRQMIwED+DnL+h5RlRonHUmnGCs9SWM76z0iULvAajGS6o0NZCSVGLTQwLtVkTDVu48RnQomdPgKgI0o4ojCFtCnVK5nSryCkRj0VLhK8iGCMOIw+y1p4n9XJyHuCC0KRx+2UsaGlZZokSjG3Iii6osBlTKKiOEHskiscWyVBGyisJbxQMUQ0GtO8kzFDVRfuOMhSLiw0IcOFHsbzO4jVfLQ0AEz+yCAmLn3CiMCOWCxUJGBYtpxPToi2YSC4TiFXw9M4waWZWyUEo3xiNYvknFSQgR6jxGtI20wAwoF2OhFF3awgd2ep9W8HM31VbREgM+qAYE56QTA3fR3r6puJqwOhXfv2bCfog0d55BIDmGU8CflHglQ6ygkvoSRTQQqZbiogIB1tQUT3cmv0VSTkcmgEF0jH7+EhA0bBlRcqPSjO/lE1ro3CQfltMLINuqSgEDIVGIjCiijA1PQUEpP9KyBYyABaqMG7DRYKceMkbB6R/gVNMTSmUJKG+2F6osNHWeQRgkSWiopx+IREgmFAjT0oivb+YddQR125lhxkgmAhBOVFEBmMFnsx0F4HdlAj9OzrFbdWElhEPuwohDLcFbhDnWpoQJ7rSCWvkSzhw2ciQ4d+joDmEhUYGREjdX2VAwYWMcKKnE2IviJnVLiOJMWWNFRjI2KGo6gvuc20xKVHUhoPX3fhoqJlSj6s5d9RHElBvLQUEJH4G+OXgIsGBrRViulFePZw3KKMNbpRakSyXaGcw//I5e0Jnp5qGix0Zkr2YUDI3o0FPp0YqtEQEs/2vMSNBh54OTnpBIAt89ba2Ipx0E8aaSyn0zKia3VxI5mO0l0Yl+92VfGRYmnR1hGBMMxo/E0n7ZwoM6XH80hVhKOvkFzooyTCgx+pjyFSrpxKQP5HSijRcACIqHiRMKJwhDGkIIN99jLugCrEfjeeyWtUNiLC51nZLcEfT3OszLX0oXncBGOhjI0gEoZHYE1VLUlateH7qU1XPWYuCRy6cOIBiP529DQgz50pQ+r+IfygKKhEImFFfRCpoAtpGJsggQohFOBlQiKKMMOHuuPVKvr5qIQ0JGJAQM2QIeB8hO1ku4J5SS6p6riH+N5bZVUkMgQhtMGJw5kIrzN3miy+AsXyX7GDxcmYusMJ+qONBxLJJHo6cYYbDiQUD3NUi3h6NFjIIaDrECDsdF1Y+1R/HKyieUy2pGACxsmv3g57nBPdgyU0pJBtMFEDiWUUER5w+4I2InDQCUJTETxLGFZig1DjfVttRiAeCIo8rig2H2CWZbRkYG4F8OWkTwFXUWHFisOXDhxoK8zcpBEHl25rIZMyliQ/MZGbITTDoVccolnIrcxHA1WDH7vSiEKC79jw4SDMErZiOL3DlRkT+/eRFitpx5OGSupRG5ErS7hIoo/+BgTkURhpgAVjc+CcWk4kTChacTbCGZOmhaAu/inEusTygkqkUjkNArRUMpO2hOHnUiy+RMwYkNFQvH4ykewmYMeq3Rd13DiNjCWYsFOBTqiOUAOHcmngha40JPFWjTeeANHej8SFVQi0Q0bFRSSQLWjSyz/sMUT7zUMKG5w/oM/7tFjFQkjCnYmM5thdKCQHM+AE1RN0jGhYsEU4PwKZbQHCjGg4iQOG6AnizDS0FHABiyk0xeLj1dGNbl04QoUyvyeuIU2ZFJBe8pRARvxtMGMAwmJMsqI53KGYuEgMRg9FgSVKMz8RrlHblTCKWETvTF6LDASESjsQEsbdpKMhliPO5OKe7H1LdibYObVEME8UmnNcjbThzP4hT+5y3MvbxKOnY2UosUdQUmCAC0dF6baM7uCiJNEANwNYd/iX7UdKtEQgxYHm8ikMy3I4S/A5KnrXBgIxwWEk8VndKi3b1+NigaFEjayER29MbOGBFQkz/KQx2IFXRUXdvRE8RWpPEglJtqynVWsozsjKcaBgyNtqEmo2AENDmzEk8rbRGAgmxaY0RLPRgqJr9PYJaFgR48BPar3KWopxk5fnJRQisJWVPoFMPXl0zdA8QcLXcjidU7nVNqjYCQdvALi9nAsJ5VM9hJLDNEYsBFBJX9QTqTXpUglgmI20hsjEImVDPaxmz5EksFm4CBlRCGjI4k/WIMBUxPemooBmUJsWHFiJI5CtjKbNMp4gJ08iYv9SKjkoqccheQARV3ChRlD0LYSTgoBcDc6WxAXcHV4ybNAkpZozKwnjt2ezOFG8WZdF5HoKW9C3a0hj01AJAo6jJ4uga7BEYKm3Z2CjIPtPEE/uvEaH5GBTKLXMfbocaLDjgYbg9jKJn5kOBo2UYSu3om1bjuEyzNk5vS4B+nRYcOO6hnB3wb0xbfJLZFHF64MUPzdw3gGrCxlHWdgohNyjfaDuy5VMWKhkhLiieYwv1NRY1E6lQhK2URPwslkJ9lAOCZcRFCEkZcxkoRKEgv4HKnJbTbVY+A1UIqKnUh0rMMdsLAdEhJhuJCwEUMJGi4OcH4ZibXsbnC16ebiJBAAhWgqMJISsPj7omJASzkKRr+ILwouT2/S7ULUtEXNIrzRdiTv4zrWo+MqRozs4BD/sp0wkig8DoNQ7uUyVSp5neVYySMCTRNn1QU6ZyTbUBjg4/BSQQ9GoAYo/u5jFGQiKOFzBpBCeZ2FQwdYyKGIlX6h6avPFE4pOygmGxdhyJ5uhYoWPXYqOUAYe9lGBJFH5DfgfzWIQkHCQtVCde54x+5417aAx+gYBEErAUEuACo6EtnM3xQ34E9VjR7NSRhTWEUlDgsHSIUmLIHZ9OuAkXh2oiOmiTEd6jqjhkh24OICEijAjgM9o8EnCEjg48Kxe4JY14cOI3mU1eFSrRJGGU7CPH4fvv/o0OEOPhdB2FEX/yrqLjKBJduG6pWAhhedP9EEtQAoRCHzN0twER10j+543K+OKL9ZDscHFZUYOGbXcdvH9zKPAXRGhwsdjlpTvgLROAu6ir4ed2wVnd8YSu1rGDA3Y+6RsCMxmOBsBQT1MGAiBXzHN+hCovgfX9Tj+gRVJKIoZAG7iMJt3Ay2rN58SNiwMpiOlAVdPg7KFoD7IWWwmg2EYcJRy3brxEmen03XRCGVHgdeGw5cuCimgCJsWNEho+CiDJffuZxYyCefEr+JSyoK+ZRTiowGKxVAPoWYa6yP5CQXB0WeDkcp2USgx+Tn5a9CrdhACjJ69DgBJy7CsXuWeJJQsKHijlNXQEmtDBNOOWFoPT5ruR6zJEAF+YAJu3dk3j2H2U4BZgqoxIHZW+e6hzzdcxmhAPfMOx0VVPjZWvQUUI4OFRUd4TgwkUEUTmp6GKpEomCnkPx6326xT30so1CODbBQSp7P5CcDJRR73oqOSp90K5ShYEbjk3mrVwkwU0wBZZi9TX4dVh87h4tKCiigBB1ayqlEi4qDAgw+g3h6HFhxYvMM9+pRKCYLB3oUtEiUkoeuCfMRVOA0jOwKshGBoBQACdjDfVRwSh172AhPHjPDKLkUSVFVZCSdJq+s8gmNQ4eKQiU6FAZfP7Rv1Ozy7dF0BtQxYRcUf7d1iW/IvRJatxk1PW/37lm+DrkqLn3vR12aHx/IdtlJw0l0u5F37N5ZOTvKPw0p58ywlW77v3h1A5AYedFDXTs+/H8HNsb47OXAwSW08lvIwoUuvfNtelXWgUtrLMpba/6ulChUHBiJxQ446HzKmZdanWpVbtGSx1OgZw1fkUgO548ed9XunfOfcBu/FCITzpoZlXD3PdmF4R7TnoyOXCwMntTl3OfbRpZm/mGam5vlbvQ5icCA091Alc94OCH8u8fyKkoZTDTO1tzDPl4Fdzy7HIwoqOGd7o8wKmjlPop60PZT/k5zDWuLSiWJjAkUdKsd0zx+RDpbSeo/f3znnsplI5xelCBRSo/Tz7jQ6b1frbbw8J7n3aMMJorZ6pl9KKPQ7gbD2Jg3sn5zy5yDMAZ55BSKGXzpkNPLPtq7tmpITo8W2etwrdCu9xk3HVh98GMTBvLZjQ4VKyPuTW9ld0qqqiAhaySFLS86s2JwkIdMMS3OO2ti+LY/no5CSwkOWqWMuSc85q17KksaG3FexUg6uZQ3sGbEiSUoBSCaw8ymDS3rNFJZiEm/6C7/bQ4OvKB1GJCppBADNs6ePqBHi5WF23u4R/4v4YYc03dLfJZxQ6Vjp7NuV/JWzYrw22o3DroforudeX4OcXQkrOtZt3c/fGB2ol8aYludOx36Pb5dzSRFv3RVj+7frvomw+VTA0pYSOFyIvxcRBwY2/e42zftrZeecV6JEyCfHthQqKTfqJF31rjtpwC6MIdSKliR8cSV/dla8MSbiVgxM+eLYaf/8vfKMvcsCAkDsIOzejy1sLsnen3qmLf+b8Xk//vAhQs7Ki1woWJF0lzwSARfnNr3lFL0jIF23E4pnmjNeewmAgVnxEC/WD5d3v+/yTnOuBpxgVYwK9AL64zf29Ks/HBMaTnAJi5BxkYeI8ae7Xe/LtY87/bnS2IX36FBDxRxavit7xq4eeCK9EQ0gAMT/dB5avkcxl7fZ0zxfv3aqniYYSg4vROZbfQYdOa08n6bPo4kgj3oCUehnPHPxdVI8sJvKrJaYGEdVuz8lPHSld3JyXn4g44YKOetr4cO+X75wopwak96rwsVDWEneIZlQwShAOix8D1WWtazBqwF3XbLxSZy2HPHsNN5hyVQaDebtYCNchQcuCg9RI/K8iheZBSnQx5U5Cp+w14urGYo3F9aoyZzKEX5cYlnnDf7/lueXkdLlEooPmDxC/tkQW8DS2Elv3IOr/6V0n3x/HFXgG+RULFwPYns9DO2OLFaYOvedTd1VO1aS5eznzj17NnX/f5OPAYK2YUGCReVRZCzJOUd72Gei6dRTgGx/L590vnzv3t89lcLDxVVMP2yYaeXl15+SoTiDnqtIJFPevKTf4eF7Vu/+EnzdkPKiKm9L73o/a9zNi5piQ4zxUS4Q2uoBZkRqd2Hzn7hpnse5iKwAPuqLltEKU4UXC6nK5PiK/rav5T2Dp1xz/Drn+pxzmDVb22odmzkI66p/cLMwHYeBPgt7ZT/9T/lo5c+vCkBFwoFGHFhoawQcpclz646RFMeTjigJYwFbKcFKjJ7eXqaAeieNnbYj3+lo2CgkgOke0KOWCjJgvIS97tyd6kqcXnfugtLGRRlluLCjIRKKRos5J0VFwm/nXX6VHklLwDYNjsxYySBw8SwddONl777+X1vz/pidzn87+qhQ0oKLj/dibNJw6hOVKKDaowqCAXAHWYyvIHelaPc9DWM5qqRw07nR752b1UxspsSH4eRGPN8XuNdvuSUxoYBAkCjUVRZmvrU8pWf/jGQnnXuZ9JtUFYz+7eUgT98fsUVcdj8PBBKSGc8hwPaWvdm3/HbatZxy7I3Yq54/PIeg4ggkbXch95bq1hXfPr1biKQsNCeOCQkMrEiYcHIgu+v/Oqci2d9cubYcM2TH8GdE/KV9jiJIA4VBYXZs8LC1q2ccupgOlC0/f7fbpl13rSXP9mdbHC4nXursqJO43RpNTfe/deKj77eRrc67lWrcTou+ew3nLz41WdzFv09cNCzM954zn/RqmgO1vWoMvgaipnFJ6vfXX3hZesnS4oeF76xBW1rPvt6N2FosBKBAxcgo6GC89ChYqcjUx+otLz34u0PnfbEEyNyAChBR1dqB+6UcOEgGrATEWAUwUYi6WwlEidJy+BqbPYzprK9Kje51w2s9MwHee+Ly38Yee6Hc8+5KNn4yHtw9fiKBtZ/CpCrvP4DwUIQCoCTSBIwNhChtB2V3MoWOkcDLQAUzIRTykG/WHU/hL1Ge0qZwFeGpqw1FhWzO2vlwmunv7P4p1Zflgyvs51nyf6YWz7pOeLXj+64NhadXwAnB1puIYE9Aae3Gg1T6cwvtErveT5c+f0GWqAi+dWo2Sn3UEAEsuSgRHUPm+kJw4WGMKzccPXB884Yc9HQ0WNN+iUL3v+pJeDAQiEuymgZd/YlLs6/KZtOhJHPEpbcenBiWsLA0Yt+SPBMmXFnR2OUo+LD12986MOvFrS57+C3dd5tkiSbbrB0ZRDf73vmrllzx9z6/nOlfo1ghay6DtauZRrh7CXlECC7Ryb8C1B+0kxyiECWnBR7/9LSGw0uZPZy40XR0QvnPv6/m2876/RJ6dsPpqBiJcJTTH1xL3DalVMJY1fAUQkJG2nkoZJMBG8xj4da4g2MVUEJJlwe9zIdVq6fdLB47IVjB51/qUb76XvfLTc22V9DwYHCsVt1+egJOgFwEU8pG8j2W6uuJgpwI6tp59Oc0hBLNBsp8Q4aOp0w6esr7WFamQKHoeGJ9z5IclLC9Lvio86/Yekvp/Xfnh14L5V8pn4+7hJ44pG9tKTcrzA4MdENc8Di7+SsfqNL4EJuiYZ5j/34s5VDqCTS3zMOANBt6j/Xx2hdgCq9Oix3TRgQRQYf4kRHFDmVUye998VXK6G89PqrdOgoIYWzUXFRSoceYCu6YptCOC5ieYgKSn9lwuA++T+kYCKDPR7jmEs2RS36nyLd/OCKn0d02nuwfR1PxUkq+8jlQaZTvlghpfXkFq5s30xUQXodx2ZFzkwp0ciOi9Jvfh1++GKb4u4CtPCxpXe8fvUk9/3CVQO3b47HHS241DPx2MzEx+H5Fwp4+snHnjvnwa9vdqFio4T2RPh54rkXh+lKP8wM5y/WkRKg2FlJwsQ6WnE7v9Larzgk0opk8lA8S6C25lDZvVc9/8kPf0uUlEy+MYyYJtfmqidUe/AQdAIQzyEeZmUDI/8yVly091srN4n7kLjap/gAyLKskTUysiI18blHGaK4/MbtYwf0e2TyT/P+R6DjbaR1TutMPolzfh7QOUv1n2xspITf6O8JE1oTSUIDLVGK5LiRo5/57c4/VKCcCkzefqUkyxpJrrqyBh3gJIF0cgkDdLz/5eVfj7oIxk/KcenJxEVb4ihFgx6tBlQ1DhMFfE8yKSjYHSB5Yvb7oCJdrpvx0OmXDOj88MNfPD2zzigiKlriyCITrRMk1EY/1aSBv2aDHT2QueHa6QWeN/moz6o8klR1v+6JTHYkHDg88Q8Oc2mfft1Xr71myyf8+krJw5ff9P2dNnMkKo4a5uKq4t8fCzYiGMl6v2D01fsZyORPkjHTggy/c7yBgsR2BuIuJhLwwvwBl088D+68tCzAEqANI3liOgUPQSQAKjIxFPEHlSTRkL+9jpqLV7pXePedm67VwscXPvFdulyCTfny6fj7mpIeK33jFxVeO+qXbTPfbDME1ADvWwJW/HjjxPnf9T1t0VcjL6o5XQV+4kqMAeagaVm6fvXAR4DXWH7RV19ds2x9THilAQe7MHvbEVtm33KrVTahwS4VutzBNV1oSacFLkDDbt57fNRF1t3jF1/rmeXwPd8SgUQJ+dvAEP95hw17buUvhmFhO7ePgL82/U4Crhr+8YOTIzJHjzx4aMZjf3dzoAuYuzUUoed6VvA2V4yQKcj5Ksvo1+opoCdjAz7P8so1O5PVPv3hq4/uu7aYSGTKuIx48rxqs+P9m280u++Xg4qOMhR0pCOhoEHDuP/BkH5D8tF0qiQCek+9/8X2qJRwBsN9nrKLcoYxADMONOQzgH6so0WAIqsgYcSIqVaOc3dBB/AdBZ7vGg4T8xTnbdm0bNnAIxzM01FIYRANBAaNALiIwsYqtqN6Flg60oaS/3HnVJbwkmLiCwY1NJeoFg6lM79uv//apz+ceC3YA8wkNeCsyD/vsGv8+J2Hz7zwiTseetXiN9nIxL+s4FwOBrob+zPEEUUZ678+WJke/lEbtgJcy2q3UQPoUDCetUo0MjrKWYkD9ziHk6ow2PHoDGC0T/aeVs9sOqECGbkblvUd9eBb80YOZDYdiWPU/9q3Kjcf/GkABmRK/bonqmsK0w9PumD+94MnKgSeN1uqWi330YPN/C/m5tfg99kyyX5GQGudXQDnmhfP/JmbL3zr66HDLBGuCj0un+lVbtoWXsJqJRoZO/2IR0FPKRnISBRyTuL4iyEjX01ySUTqclJTJt71xosmjJ45+dWU5LWnF6We4OE2YjiDLXV4J9ZqDdXgPP+feiizRh2xU6+GeMpwNbB07IkjKARAwkAUmWSwivgmxNlpDKVhF+FgJMOgsR4bXuzEE84zHw0+9cKbQA2YLLu5t+shZhZcd/7HSx98ZdXKH9ZG+2RFCQtrGRcws6TG3dArV9rl7Be7aFJ6eAn/l6HDgINsqld0zO4idR+tk1CJ0OTY1myTFD3goMS72ITDvSyWT35KZDs2ZCRyeXbyp3vHn3nRss+eTlmvaX3J9d3ugEevXG/r4Amh7tteymE4HVjww5hnrr5PDtgAcyla+X+jh5gzjf17X/qgNnbv9oefVDnks4eGTVxEYBI1P3Iub39z7gcXXLf4z6F9FSJwsp0+Pt2mnI5q97N0MiqyRrbat0oYMbMLC0Z2c/k98O1bU6e0RMKGXvP9v227XHHe29+nAYfogR4H7vfUdzglkkaLTkLDWkorGUgP/g24dl8T0YNeK2M/wiLsdvXKrTOK0onmBAuAhIrD2wtyeuaWOzBj4zdctZZBbPh8hlaAjw+H1hOPXkXCmAaayHymuWvUJNAnS34vTkYbBmFtDfh7AmpkCAONgU5sZvLNnQZ362Vqp61h4tMbICypQB6ltOeTn4Y+Me2hL9cM67tno69LicJq9pDs59PgxGCC7l1mbare9tblL3sWRxxOFHYkdHHQZ2If70La+fwYaa8weVKoenq07jugQ/WZTiGK5USjIrNtX/io2Z8ZRl4+8lyM6HGw8bYdXysU48REPBIqMpJkCgNV246LeJ5r7+8ydNDp1Wc0YcCIgkujyi25ail0BGDlovlXmxWT3/BbIf24ONCLCgPayXxACy6/fseYnn3mfHX1BMUJO8ihFRVoMcRDj4t6+OqHBkUlhzWAg/NTp82Ar/8vDsltR3DNeurxuZMWzo+x2sGCCxOgRZ8CI+7lXu9ZzmEJQAJWNEjoosCUWvXGTT4rGEjoYoFU6iMcjO1kv7UlmoZKPOVHLCDHGj8BeKS5U3MEvDE/r6R0RdXNKBR7fPdV7Ox5t+OwPduKKaYPoC6Ojsv8we7nk2elaH/mZ4e37K/hv++wtXjfLFVYrOhpyx7uHvXRS/u3+6/wZsWSs+cTS+EmtTMD2cut/+uoGz14ct/JG32XlYjgMD8yijyfI53oD4Z/ZERvVNFrip2rt+z5JnObEQ1OWiJRiISdnL+y51tdeoPb9mDUZhRbHdXr4SjeVBTuO/CZsqc6ZS2YyCO4PLMK1/7yRYf4qSOHRYVj+2XDgvf77OrAJnRo0FGJgoQNybX1zeSwfWXltCSCCiaOXTQn7pDF80x3kokJBVdl+JyYMEmj1VSwe1fOsp//iqYV/oOAdi7EEWjhtX18zno9Dtqyn+tGfzRjbOzwmD0FcZSxBy3lFHHg94zWTqfeqLrHBnXkoUIc37CAaEqZ0Epe+vmfS7PSMCGjI4Lv5k8cltpiRmxZbhgKmRShoYA9n7cpszlk99qEEjJ7QIOGfGxUYCdvY+6X23/Z7+nXF5HnyTFgJ3d11lfmZfVWQrsiF+7euvkY5+Jj2Rq41vttWq3/7q61RQqOhohAIGgOgno6sEAgOL4IARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQhghAAJBCCMEQCAIYYQACAQhjBAAgSCEEQIgEIQwQgAEghBGCIBAEMIIARAIQpj/B3b1mqChMhSrAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA3LTIyVDA5OjQ0OjI1KzAwOjAwO4Sp1wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNy0yMlQwOTo0NDoyNSswMDowMErZEWsAAAAASUVORK5CYII=", A.childNodes.length > 0 ? A.insertBefore(E, A.childNodes[0]) : A.appendChild(E), E.onload = function () {
            A.style.display = "block"
        }
    }), A.on("preload:end", function () {
        A.off("preload:progress")
    }), A.on("preload:progress", function (A) {
        var E = document.getElementById("progress-bar");
        E && (A = Math.min(1, Math.max(0, A)), E.style.width = 100 * A + "%")
    }), A.on("start", function () {
        var A = document.getElementById("application-splash-wrapper");
        A.parentElement.removeChild(A)
    })
});
var LookCamera = pc.createScript("lookCamera");
LookCamera.attributes.add("mouseLookSensitivity", {
    type: "number",
    default: 0,
    title: "Mouse Look Sensitivity"
}), LookCamera.attributes.add("touchLookSensitivity", {
    type: "number",
    default: 0,
    title: "Touch Look Sensitivity"
}), LookCamera.attributes.add("snappinessFactor", {
    type: "number",
    default: .1,
    title: "Snappiness Factor",
    description: "Lower is faster"
}), LookCamera.prototype.initialize = function () {
    this._tempQuat1 = new pc.Quat, this._tempQuat2 = new pc.Quat, this._tempVec3_1 = new pc.Vec3;
    var t = this.entity.getLocalRotation();
    this.ey = this.getYaw(t) * pc.math.RAD_TO_DEG, this.ex = this.getPitch(t, this.ey) * pc.math.RAD_TO_DEG, this.targetEx = this.ex, this.targetEy = this.ey, this.moved = !1, this.app.mouse.disableContextMenu(), this.lastTouchPosition = new pc.Vec2, this.addEventCallbacks()
}, LookCamera.prototype.addEventCallbacks = function () {
    this.app.mouse && this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this), this.app.touch && (this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this), this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this))
}, LookCamera.prototype.update = function (t) {
    var e = 1;
    this.snappinessFactor > 0 && (e = t / this.snappinessFactor), this.ex = pc.math.lerp(this.ex, this.targetEx, e), this.ey = pc.math.lerp(this.ey, this.targetEy, e), this.entity.setLocalEulerAngles(this.ex, this.ey, 0)
}, LookCamera.prototype.moveCamera = function (t, e, o) {
    this.moved ? (this.targetEx -= e * o, this.targetEx = pc.math.clamp(this.targetEx, -90, 90), this.targetEy -= t * o) : this.moved = !0
}, LookCamera.prototype.onMouseMove = function (t) {
    !0 === this.entity.enabled && this.app.mouse.isPressed(pc.MOUSEBUTTON_LEFT) && this.moveCamera(t.dx, t.dy, this.mouseLookSensitivity)
}, LookCamera.prototype.onTouchStart = function (t) {
    if (!0 === this.entity.enabled) {
        var e = t.touches[0];
        this.lastTouchPosition.set(e.x, e.y)
    }
}, LookCamera.prototype.onTouchMove = function (t) {
    if (!0 === this.entity.enabled) {
        var e = t.touches[0];
        this.moveCamera(-(e.x - this.lastTouchPosition.x), -(e.y - this.lastTouchPosition.y), this.touchLookSensitivity), this.lastTouchPosition.set(e.x, e.y)
    }
}, LookCamera.prototype.getYaw = function () {
    var t = this.entity.forward.clone();
    return Math.atan2(-t.x, -t.z)
}, LookCamera.prototype.getPitch = function (t, e) {
    var o = this._tempQuat1, i = this._tempQuat2;
    i.setFromEulerAngles(0, -e, 0), o.mul2(i, t);
    var a = this._tempVec3_1;
    return o.transformVector(pc.Vec3.FORWARD, a), Math.atan2(a.y, -a.z)
};
var IntExtManager = pc.createScript("intExtManager");
IntExtManager.attributes.add("intRoot", {type: "entity"}), IntExtManager.attributes.add("extRoot", {type: "entity"}), IntExtManager.attributes.add("freeCam", {type: "entity"}), IntExtManager.attributes.add("cameraDistanceAfterZoom", {
    type: "number",
    default: .5
}), IntExtManager.attributes.add("fadeInOutPicture", {type: "entity"}), IntExtManager.attributes.add("fadeInOutDuration", {
    type: "number",
    default: .5
}), IntExtManager.prototype.initialize = function () {
    this.app.on("intext:set", function (t) {
        this.setupScene(t)
    }, this)
}, IntExtManager.prototype.setupScene = function (t) {
    switch (t) {
        case"int":
            this.goToInt();
            break;
        case"ext":
            this.goToExt();
            break;
        default:
            console.log("Unexpected intExt value : " + t)
    }
}, IntExtManager.prototype.goToInt = function () {
    this.app.fire("orbit:startmoving"), this.fadeInOut(!0, !1)
}, IntExtManager.prototype.goToExt = function () {
    this.fadeInOut(!1, !0)
}, IntExtManager.prototype.fadeInOut = function (t, e) {
    var a = this;
    this.originalFreeCamClampValuesState = this.freeCam.script.orbitCamera.clampValues.valueOf(), this.freeCam.script.orbitCamera.clampValues = !1, !0 === t && (this.originalCamDistance = this.freeCam.script.orbitCamera.distance.valueOf(), this.originalFreeCamInertiaFactor = this.freeCam.script.orbitCamera.inertiaFactor.valueOf()), this.freeCam.script.orbitCamera.inertiaFactor = 0;
    var i = {value: this.originalCamDistance},
        n = this.entity.tween(i).to({value: this.cameraDistanceAfterZoom}, this.fadeInOutDuration, pc.QuinticIn).on("update", function () {
            a.freeCam.script.orbitCamera.distance = i.value
        }).on("complete", function () {
            a.freeCam.script.orbitCamera.clampValues = a.originalFreeCamClampValuesState
        });
    !0 === t && n.start();
    var r = {value: 0};
    this.entity.tween(r).to({value: 1}, this.fadeInOutDuration, pc.QuinticIn).on("update", function () {
        a.fadeInOutPicture.element.opacity = r.value
    }).on("complete", function () {
        a.switchViewAndFadeOut(t, e)
    }).start()
}, IntExtManager.prototype.switchViewAndFadeOut = function (t, e) {
    var a = this;
    this.intRoot.enabled = t, this.extRoot.enabled = e;
    var i = {value: this.cameraDistanceAfterZoom},
        n = this.entity.tween(i).to({value: this.originalCamDistance}, this.fadeInOutDuration, pc.QuinticIn).on("update", function () {
            a.freeCam.script.orbitCamera.distance = i.value
        }).on("complete", function () {
            a.freeCam.script.orbitCamera.clampValues = a.originalFreeCamClampValuesState, a.freeCam.script.orbitCamera.inertiaFactor = a.originalFreeCamInertiaFactor, a.app.fire("ondemand:showLastImage")
        });
    !0 === e && n.start();
    var r = {value: 1};
    this.entity.tween(r).to({value: 0}, this.fadeInOutDuration, pc.QuinticIn).on("update", function () {
        a.fadeInOutPicture.element.opacity = r.value
    }).start()
}, IntExtManager.prototype.update = function (t) {
    this.app.keyboard.wasPressed(pc.KEY_I) && this.goToInt(), this.app.keyboard.wasPressed(pc.KEY_O) && this.goToExt()
};// LSWebSocket.js
const AVAILABLE = 0;
const UNAVAILABLE = -1;

const MESSAGESENDED = 10;
const EMPTYMESSAGE = -10;
const ERRORSEND = -11;

var debug = false;

function debugLog(...args) {
    if (debug) {
        for (var i = 0; i < arguments.length; i++) {
            console.log(i + ": " + arguments[i]);
        }
    }
}

class LSWebSocket {

    constructor(pUrl) {
        this.url = pUrl;
        this.socket = null;

        this.onSocketOpen = null;
        this.onSocketClose = null;
        this.onSocketReceive = null;
        this.onSocketSend = null;
        this.onSocketError = null;
    }

    // CONSTANT

    static get AVAILABLE() {
        return AVAILABLE;
    }

    static get UNAVAILABLE() {
        return UNAVAILABLE;
    }

    static get MESSAGESENDED() {
        return MESSAGESENDED;
    }

    static get EMPTYMESSAGE() {
        return EMPTYMESSAGE;
    }

    static get ERRORSEND() {
        return ERRORSEND;
    }

    // END CONSTANT

    getSocket() {
        return this.socket;
    }

    setSocket(pSocket) {
        this.socket = pSocket;
    }

    getUrl() {
        return this.url;
    }

    setUrl(pUrl) {
        this.url = pUrl;
    }

    // CUSTOM EVENT CALLED AFTER OUR EVENT - 1 PARAM : event
    onOpenCallback(pCallback) {
        this.onSocketOpen = pCallback;
    }

    // CUSTOM EVENT CALLED AFTER OUR EVENT - 1 PARAM : event
    onClosedCallback(pCallback) {
        this.onSocketClose = pCallback;
    }

    // CUSTOM EVENT CALLED AFTER OUR EVENT - 1 PARAM : event
    onReceivedCallback(pCallback) {
        this.onSocketReceive = pCallback;
    }

    // CUSTOM EVENT CALLED AFTER OUR EVENT - 1 PARAM : event
    onErrorCallback(pCallback) {
        this.onSocketError = pCallback;
    }

    // CUSTOM EVENT CALLED AFTER OUR EVENT - 1 PARAM : event
    onSendedCallback(pCallback) {
        this.onSocketSend = pCallback;
    }

    onOpen(self, event) {
        debugLog("SOCKET OPENNED");

        if (this.onSocketOpen) {
            this.onSocketOpen(event);
        }
    }

    onClose(self, event) {
        debugLog("SOCKET CLOSED");

        if (this.onSocketClose) {
            this.onSocketClose(event);
        }
    }

    onError(self, event) {
        debugLog("ERROR EVENT");

        if (this.onSocketError) {
            this.onSocketError(event);
        }
    }

    onReceive(self, event) {
        debugLog("RECEIVE EVENT");

        if (this.onSocketReceive) {
            this.onSocketReceive(event);
        }
    }

    open() {
        var self = this;

        if (this.url) {
            // Create socket
            //TODO try catch
            this.socket = new WebSocket(this.url);
            this.socket.binaryType = "arraybuffer";

            // Assign socket events
            this.socket.onopen = function (event) {
                self.onOpen(self, event);
            };

            this.socket.onmessage = function (event) {
                self.onReceive(self, event);
            };

            this.socket.onclose = function (event) {
                self.onClose(self, event);
            };

            this.socket.onerror = function (event) {
                self.onError(self, event);
            };
            // End assign
        } else {
            debugLog("Please ensure that you provided a valid URL.");
        }
    }

    close() {
        if (this.checkSocketStatus() == this.AVAILABLE) {
            this.socket.close("dunno");
            return this.AVAILABLE;
        } else {
            debugLog("Socket has been already close");
            return this.UNAVAILABLE;
        }
    }

    checkSocketStatus() {
        if (this.socket == null) {
            debugLog("NULL");
            return this.UNAVAILABLE;
        }

        if (this.socket.readyState != WebSocket.OPEN) {
            debugLog("NOT OPEN", this.socket.readyState);
            return this.UNAVAILABLE;
        }

        debugLog("AVAILABLE");
        return this.AVAILABLE;
    }

    sendMessage(pMessage) {
        //TODO handle reconnection
        if (this.checkSocketStatus() != this.AVAILABLE) {
            debugLog("UNAVAILABLE", this.UNAVAILABLE);
            return this.UNAVAILABLE;
        }

        if (!pMessage) {
            debugLog("EMPTY MESSAGE");
            return this.EMPTYMESSAGE;
        }

        try {
            this.socket.send(JSON.stringify(pMessage));

            if (this.onSocketSend)
                this.onSocketSend();
        } catch (exception) {
            // console.error(exception);
            return this.ERRORSEND;
        }

        debugLog("SENDED");
        return this.MESSAGESENDED;
    }
}

var LsonDemandManager = pc.createScript("lsonDemandManager");
LsonDemandManager.attributes.add("serverPicture", {type: "entity"}), LsonDemandManager.attributes.add("fadeInOutDuration", {
    type: "number",
    default: .4
});
var l_App = pc.app;
LsonDemandManager.prototype.initialize = function () {
    var e = new LSWebSocket("ws://127.0.0.1:4649/WSS"), t = new LSContext(this), a = this;
    this.image = new Image, this.texture = new pc.Texture(a.app.graphicsDevice), this.texture.mipmaps = !1, this.texture.flipY = !1, this.imageIsVisible = !0, this.currentAlpha = {value: 0}, this.tweenAlphaIn = this.entity.tween(this.currentAlpha).to({value: 1}, this.fadeInOutDuration, pc.QuinticIn).on("update", function () {
        a.serverPicture.element.material.opacity = a.currentAlpha.value, a.serverPicture.element.material.update()
    }), this.tweenAlphaOut = this.entity.tween(this.currentAlpha).to({value: 0}, this.fadeInOutDuration, pc.QuinticIn).on("update", function () {
        a.serverPicture.element.material.opacity = a.currentAlpha.value, a.serverPicture.element.material.update()
    }), e.open(), e.onOpenCallback(function (e) {
    }), e.onReceivedCallback(function (e) {
        a.image.src = "data:image/jpg;base64," + e.data, a.serverPicture.element.material.emissiveMap = a.texture, a.serverPicture.element.material.update(), a.texture.setSource(a.image), a.fadeIn(a)
    }), this.app.on("ondemand:askForNewImage", function () {
        e.sendMessage(t)
    }, this), this.app.on("orbit:startmoving", function () {
        !0 === a.imageIsVisible && a.fadeOut(a)
    }, this), this.app.on("ondemand:showLastImage", function () {
        a.fadeIn(a)
    }, this)
}, LsonDemandManager.prototype.fadeIn = function (e) {
    e.imageIsVisible = !0, e.currentAlpha.value = 0, e.tweenAlphaIn.start()
}, LsonDemandManager.prototype.fadeOut = function (e) {
    e.imageIsVisible = !1, e.currentAlpha.value = 1, e.tweenAlphaOut.start()
};// LSContext.js
class LSContext {

    constructor(p_Script) {
        this.script = p_Script;

        this.type = "UPDATE";

        this.height = 0;
        this.width = 0;

        this.yaw = 0;
        this.pitch = 0;
        this.distance = 0;
        this.fov = 45;

        this.color = 0;
        this.env = 0;

        this.script.app.on("ondemand:updateCamera", this.UpdateCamera, this);
        this.script.app.on("ondemand:updateColor", this.UpdateColor, this);
        this.script.app.on("ondemand:updateEnv", this.UpdateEnv, this);
    }

    UpdateSize() {
        this.width = this.script.app.graphicsDevice.canvas.clientWidth;
        this.height = this.script.app.graphicsDevice.canvas.clientHeight;
    }

    UpdateCamera(pitch, yaw, distance, fov) {
        this.UpdateSize();

        this.pitch = -pitch;
        this.yaw = -yaw + 180;
        this.distance = distance;
        this.fov = fov;
        this.script.app.fire("ondemand:askForNewImage");
        // console.log(pitch)
        // console.log(yaw)
        // console.log(distance)
    }

    UpdateColor(color) {
        this.UpdateSize();

        this.color = color;

        this.script.app.fire("ondemand:askForNewImage");
    }

    UpdateEnv(env) {
        this.UpdateSize();

        this.env = env;

        this.script.app.fire("ondemand:askForNewImage");
    }

    toJSON() {
        return {
            type: this.type,
            width: this.width,
            height: this.height,
            yaw: this.yaw,
            pitch: this.pitch,
            distance: this.distance,
            color: this.color,
            environment: this.env,
            fov: this.fov,
        };
    }
}

