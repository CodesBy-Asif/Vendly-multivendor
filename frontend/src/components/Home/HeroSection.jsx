export default function HeroSection() {
    return (
        <section className="bg-background mb-16 min-h-114 py-10 pt-8 px-6 md:px-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
                {/* Left Text */}
                <div className="w-full text-center md:text-left">
                    <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight font-davigo">
                        Fresh New <br/>Modern <br /><span className={"text-primary font-ananda tracking-widest italic"}>Collection</span>
                    </h1>
                    <p className="text-muted-foreground mb-6 font-roboto">
                        Introducing our exciting fresh new modern collection. Dive into the cutting-edge of
                        contemporary fashion and elevate your wardrobe with enduring elegance.
                    </p>
                    <button className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full hover:bg-primary-dark transition font-roboto">
                        Order Now
                        <span className="text-xl">&rarr;</span>
                    </button>
                </div>

                {/* Right Images */}
                <div className="w-full aspect-[3/2] flex gap-4 justify-center">
                    <div className="w-1/2 ">
                        <img
                            src="https://media.istockphoto.com/id/1187160694/photo/indian-young-man-with-beard-and-mood.jpg?s=612x612&w=0&k=20&c=zEwU-5-p4q4kLo8qdMilnmngyTXKUIakkAYwhEM00N0="
                            alt="Model 1"
                            className=" clip-polygon-hero object-cover w-full h-full"
                        />
                    </div>
                    <div className="w-1/2">
                        <img
                            src="https://media.istockphoto.com/id/1324337298/photo/fashionable-woman-in-sunglasses-holding-shopping-bags.jpg?s=612x612&w=0&k=20&c=dzJygCicvo_PgYd2D5tW1t2KvafcYyUVRRRs8SPtrgs="
                            alt="Model 2"
                            className="clip-polygon-hero  object-cover w-full h-full"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
