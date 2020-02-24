import "phaser";

interface Lives {
    lives: number;
}

interface State {
    state: number | string;
}

export function addOrTakeLives<T extends Lives>(
    obj: T,
    amount: number = 1
): void {
    obj.lives += amount;
}

export function changeState<T extends State>(
    obj: T,
    delay: number,
    newState: number | string
): void {
    // We put type assertion to bypass compiler error

    (obj as any).scene.time.delayedCall(
        delay,
        () => {
            obj.state = newState;
        },
        [],
        (obj as any).scene
    );
}
