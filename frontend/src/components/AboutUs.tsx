export default function AboutUs() {
  const people = [
    {
      name: "Khannapong Wangkrasaer",
      role: "Developer",
      image: "/images/mix.png",
      bio: "eiei",
    },
    {
      name: "Kritsada Limsripraphan",
      role: "Developer",
      image: "/images/jing.png",
      bio: "haha",
    },
  ];

  return (
    <main className="mt-0 px-6 py-12 bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 animate-colorGlow">
            About Us
          </h1>

          <p className="text-gray-600 text-lg">lnwza007 ❤️</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {people.map((person, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl shadow-md p-6 flex flex-col items-center text-center 
                transition-transform transform hover:-translate-y-2 hover:shadow-xl duration-300"
            >
              <img
                src={person.image}
                alt={person.name}
                className="w-32 h-32 object-cover rounded-full mb-4 shadow"
              />
              <h2 className="text-xl font-semibold text-gray-800">
                {person.name}
              </h2>
              <p className="text-sm text-indigo-500 mb-2">{person.role}</p>
              <p className="text-gray-600 text-sm">{person.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
