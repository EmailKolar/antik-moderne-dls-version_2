import { useTheme } from "next-themes";

export const AboutSection = () => {
  const { theme } = useTheme();

  return (
    <div>
      <section
        className={`py-20 ${
          theme && theme === "dark" ? "bg-gray-700" : "bg-gray-300"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Antik Moderne</h1>
          <p className="text-xl">Discover the art of timeless elegance</p>
        </div>
      </section>

      <section
        className={`py-16 ${
          theme && theme === "dark" ? "bg-gray-500" : "bg-gray-50"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Our Story</h2>
          <p className="mb-6">
            Antik Moderne is a family-owned business that has been curating and
            selling high-quality antique posters and art prints for over 50
            years. Our passion for preserving the beauty and craftsmanship of
            these timeless pieces has been passed down through generations, and
            we take great pride in sharing our collection with the world.
          </p>
          <p className="mb-6">
            Our showroom is a treasure trove of rare and unique finds, each with
            its own captivating story. From vintage travel posters to iconic
            movie advertisements, our collection spans a wide range of eras and
            styles, catering to the diverse tastes of our customers.
          </p>
          <p className="mb-6">
            At Antik Moderne, we believe that art has the power to transform a
            space and evoke emotions. That's why we're dedicated to providing
            our customers with the finest antique posters and art prints,
            carefully selected and expertly restored to preserve their original
            beauty and charm.
          </p>
        </div>
      </section>

      <section
        className={`about-section py-16 ${
          theme && theme === "dark" ? "bg-gray-700" : "bg-gray-300"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Visit Us</h2>
          <p className="mb-6">
            Our showroom is located in the heart of the city, where you can
            browse our collection and immerse yourself in the world of Antik
            Moderne. Come and experience the beauty of our posters firsthand,
            and let our knowledgeable staff guide you through the rich history
            and craftsmanship behind each piece.
          </p>
          <p className="mb-6">
            We look forward to welcoming you to Antik Moderne and helping you
            find the perfect addition to your home or office.
          </p>
        </div>
      </section>
    </div>
  );
};
