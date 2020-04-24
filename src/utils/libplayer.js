
export function addOrTakeLives(
    obj,
    amount = 1
) {
    obj.lives += amount;
}

export function changeState(
    obj,
    delay,
    newState
) {
    // We put type assertion to bypass compiler error

    obj.scene.time.delayedCall(
        delay,
        () => {
            obj.state = newState;
        },
        [],
        obj.scene
    );
}
