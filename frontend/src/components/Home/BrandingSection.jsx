import { features } from "../../static/Features.jsx";
import { categories } from "../../static/Categories.js";
import { Link } from "react-router-dom";
import {BiRightArrow} from "react-icons/bi"; // icon for "See All"

export default function BrandingSection() {
    return (
        <>
            {/* Feature Icons */}
            <section className="bg-accent mb-16 py-8 px-4 md:px-8 mx-6 rounded-lg">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 justify-between gap-6 text-center">
                    {features.map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="text-4xl text-primary-dark">{item.icon}</div>
                            <div className="text-start">
                                <h4 className="font-bold tracking-wide text-lg text-primary-dark">
                                    {item.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Category Grid */}
            <section className="py-4 px-4 mb-16 md:px-8 mx-6 my-3 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
                    {categories.slice(0, 7).map((item, i) => (
                        <Link
                            to={`/products?category=${item.slug}`}
                            key={i}
                            className="flex hover:shadow-xl shadow-primary/20 rounded-3xl hover:scale-105 w-full overflow-hidden justify-between items-center gap-4 bg-accent px-5 py-3 transition leading-6"
                        >
                            <p className="text-md text-primary-dark font-bold">{item.name}</p>
                            <img
                                src={item.image}
                                className="w-1/2 aspect-square rounded-md object-cover"
                                alt={item.name}
                            />
                        </Link>
                    ))}

                    {/* "View All Categories" Card */}
                    <Link
                        to="/products"
                        className="flex flex-col items-center justify-center gap-2 bg-primary text-primary-foreground rounded-3xl hover:bg-primary-dark transition px-5 py-6 text-center"
                    >
                        <BiRightArrow className="w-6 h-6" />
                        <span className="text-sm font-semibold">See All</span>
                    </Link>
                </div>
            </section>
        </>
    );
}
