// freeze-tracker.js
const origFreeze = Object.freeze;
Object.freeze = function (obj) {
    try {
        return origFreeze(obj);
    } catch (err) {
        console.error("Freeze failed for object:", obj, "\nError:", err);
        throw err;
    }
};
