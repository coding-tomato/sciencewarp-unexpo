interface Lives {
    
    lives: number
    
}

// Add lives

export function addOrTakeLives<T extends Lives>(obj: T, amount: number = 1): void {
    // New
    obj.lives += amount;
   
}
