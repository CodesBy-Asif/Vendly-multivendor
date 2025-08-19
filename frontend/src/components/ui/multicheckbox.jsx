import { useState } from "react";

export const CustomMultiSelect = ({ options, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const toggleOption = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-muted-foreground mb-1">
        Applicable Products (optional)
      </label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 border border-border rounded-lg  text-left"
      >
        {selected.length > 0
          ? `${selected.length} selected`
          : "Select products"}
      </button>

      {open && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
          {options.map((product) => (
            <label
              key={product.id}
              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={selected.includes(product._id)}
                onChange={() => toggleOption(product._id)}
              />
              {product.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
