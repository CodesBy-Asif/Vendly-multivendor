import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {faqs} from "../static/Faq.js";


const FAQPage = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggle = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <section className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-primary-dark mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs.map((item, index) => (
                    <div
                        key={index}
                        className="border border-primary/20 bg-accent rounded-lg transition-all"
                    >
                        <button
                            onClick={() => toggle(index)}
                            className="w-full flex justify-between items-center p-4 text-left"
                        >
                            <span className="text-primary-dark font-medium">{item.question}</span>
                            {activeIndex === index ? (
                                <IoIosArrowUp className="text-primary w-5 h-5" />
                            ) : (
                                <IoIosArrowDown className="text-primary w-5 h-5" />
                            )}
                        </button>
                        {activeIndex === index && (
                            <div className="px-4 pb-4 text-sm text-muted-foreground">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQPage;
