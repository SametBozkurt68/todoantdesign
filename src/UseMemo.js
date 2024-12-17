import React, { useState, useMemo } from "react";

function Example() {
    const [count, setCount] = useState(0);
    const [otherState, setOtherState] = useState(0);

    // useMemo ile hesaplama
    const expensiveCalculation = useMemo(() => {
        console.log("Ağır hesaplama yapılıyor...");
        return count * 2;
    }, [count]); // 'count' değiştikçe hesaplama tekrar yapılır.

    return (
        <div>
            <h1>Ağır Hesaplama Sonucu: {expensiveCalculation}</h1>
            <button onClick={() => setCount(count + 1)}>Count Artır</button>
            <button onClick={() => setOtherState(otherState + 1)}>OtherState Artır</button>
        </div>
    );
}

export default Example;
