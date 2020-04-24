

export function isObjectNear(
    range,
    firstObj,
    secondObj
) {
    try {
        if (
            (firstObj.x <= secondObj.x + 100 && firstObj.x >= secondObj.x) ||
            (firstObj.x >= secondObj.x - 100 && firstObj.x <= secondObj.x)
        ) {
            console.log(
                Math.abs(
                    Phaser.Math.Distance.Between(
                        firstObj.x,
                        firstObj.y,
                        secondObj.x,
                        secondObj.y
                    )
                )
            );

            return Math.abs(
                Phaser.Math.Distance.Between(
                    firstObj.x,
                    firstObj.y,
                    secondObj.x,
                    secondObj.y
                )
            );
        }
    } catch (err) {
        console.log(`Could not check coordinates: ${err}`);
    }
}

export function reset(object, state, time = 100) {
    try {
        if (!("state" in object)) {
            throw "Object has no 'state' property.";
        }

        object.scene.time.delayedCall(time, () => {
            object.state = state;
        });
    } catch (err) {
        console.error(`Could not reset state: ${err}`);
    }
}

export function shoot(projNum, className, timeBetween) {
    console.log("Hello");
}
