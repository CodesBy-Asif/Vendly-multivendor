import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { categories } from "../../static/Categories.js";

const filters = {
    categories: categories,
};

const FilterSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchText, setSearchText] = useState(searchParams.get("q") || "");
    const [selectedCategories, setSelectedCategories] = useState(searchParams.getAll("category") || []);
    const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");

    const [openSections, setOpenSections] = useState({
        categories: true,
        price: true,
    });

    useEffect(() => {
        const params = new URLSearchParams();
        if (searchText) params.set("q", searchText);
        if (minPrice) params.set("min", minPrice);
        if (maxPrice) params.set("max", maxPrice);
        selectedCategories.forEach((cat) => params.append("category", cat));
        setSearchParams(params);
    }, [searchText, selectedCategories, minPrice, maxPrice]);

    const toggleCategory = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const toggleSection = (key) => {
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const clearFilters = () => {
        setSearchText("");
        setSelectedCategories([]);
        setMinPrice("");
        setMaxPrice("");
        setSearchParams({});
    };

    return (
        <div className="flex flex-col h-full max-h-[85vh] overflow-y-auto space-y-6 bg-accent p-4 rounded-xl text-foreground scrollbar-thin scrollbar-thumb-muted-foreground/50">
            {/* Search input */}
            <div>
                <h4 className="text-sm font-semibold mb-2">Search</h4>
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full border border-border bg-accent text-sm text-foreground rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            {/* Categories */}
            <div>
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection("categories")}
                >
                    <h4 className="text-sm font-semibold hover:underline mb-2">Categories</h4>
                    {openSections.categories ? (
                        <IoIosArrowUp className="w-4 h-4" />
                    ) : (
                        <IoIosArrowDown className="w-4 h-4" />
                    )}
                </div>
                {openSections.categories && (
                    <ul className="space-y-1">
                        {filters.categories.map(({ slug, name }) => (
                            <li key={slug}>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        className="accent-primary"
                                        checked={selectedCategories.includes(slug)}
                                        onChange={() => toggleCategory(slug)}
                                    />
                                    {name}
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Price Range */}
            <div>
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection("price")}
                >
                    <h4 className="text-sm font-semibold mb-2">Price</h4>
                    {openSections.price ? (
                        <IoIosArrowUp className="w-4 h-4" />
                    ) : (
                        <IoIosArrowDown className="w-4 h-4" />
                    )}
                </div>
                {openSections.price && (
                    <div className="flex gap-2 items-center">
                        <input
                            type="number"
                            placeholder="Min"
                            className="w-full border border-border bg-accent text-sm rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            className="w-full border border-border bg-accent text-sm rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* Clear Filters Button */}
            <button
                onClick={clearFilters}
                className="w-full bg-primary text-primary-foreground hover:bg-primary-dark transition-colors duration-200 py-2 rounded text-sm font-semibold mt-auto"
            >
                Clear Filters
            </button>
        </div>
    );
};

export default FilterSidebar;
