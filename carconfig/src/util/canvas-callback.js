export const setFire = (value, newValue, app) => {
    app.fire(value + ":set", newValue)
};