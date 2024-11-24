import Image from "next/image";

/**
 * My image from public directory
 */
import me from "../../public/me.jpeg";

export default function Profile() {
  return (
    <>
      <div className="rounded-3xl overflow-hidden w-64 h-64 mb-6">
        <Image src={me} alt="Aji Hamdani Ahmad" />
      </div>
      <div className="md:px-10 md:flex md:flex-col md:justify-center lg:justify-start lg:px-0">
        <h1 className="text-3xl font-serif mb-3 md:text-4xl md:mb-4">
          I'm Aji Hamdani Ahmad
        </h1>
        <p className="text-lg text-gray-700 md:text-xl">
          FullStack Developer based in Lamongan, Indonesia.
        </p>
      </div>
    </>
  );
}
