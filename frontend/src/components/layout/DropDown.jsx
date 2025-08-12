import {useState} from "react";
import {Link} from "react-router-dom";

const DropDown=(prop) =>{
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className="absolute mx-auto w-full left-[2%] top-[89%] 400:w-max shadow-xl shadow-border mt-2 z-10 bg-background p-4">
            <div className="md:max-h-64 w-full overflow-y-auto">
                {prop.Catagories.map((cat, index) => (
                    <Link
                        key={index}
                        to={cat.url}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`block px-3 py-1  hover:bg-muted transition-colors ${
                            activeIndex === index ? "bg-muted font-semibold" : ""
                        }`}
                    >
                        {cat.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}
export default DropDown;
