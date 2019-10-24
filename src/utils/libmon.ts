import "phaser";

export function isObjectNear(range: number, firstObj: any, secondObj: any): number {

    try {

        if (firstObj.x <= secondObj.x + 100 && firstObj.x >= secondObj.x || 
            firstObj.x >= secondObj.x - 100 && firstObj.x <= secondObj.x) {

            return (Math.abs(Phaser.Math.Distance.Between(
                firstObj.x, firstObj.y, secondObj.x, secondObj.y)));
        }

    } catch(err) {

        console.log(`Could not check coordinates: ${err}`);

    }
}

export function reset(object: any, state: any, time: number = 100): void {
    try {
        if (!('state' in object)) {
            throw "Object has no 'state' property.";
        }

        object.scene.time.delayedCall(time, () => { object.state = state });

    } catch(err) {

        console.error(`Could not reset state: ${err}`);

    }
}

export function shoot(projNum: any, className: any, timeBetween: any) {
    console.log("Hello");
}
