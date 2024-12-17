import React, { useState, useCallback } from "react";

function FilteredList() {
    const [query, setQuery] = useState("");
    const [list, setList] = useState(["Apple", "Banana", "Cherry", "Date", "Grape"]);


    const getFilteredItems = useCallback(() => {
        return list.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
    }, [list, query]);

    return (
        <div>
            <h2>Filtreli Liste</h2>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ara..."
            />
            <ul>
                {getFilteredItems().map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default FilteredList;
