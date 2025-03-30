import Timer from './components/Timer';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="img/bg1.png" // can be changed later
          alt="Study Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay */}
      </div>

      {/* Timer Card */}
      <div className="flex justify-center items-center h-screen px-4">
        <Timer />
      </div>
    </main>
  );
}