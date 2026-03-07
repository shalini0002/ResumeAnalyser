export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Resume Analysis Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">ATS Score</h2>
          <p className="text-4xl mt-4 text-green-600">74%</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Matched Skills</h2>
          <ul className="mt-3">
            <li>React</li>
            <li>JavaScript</li>
            <li>HTML</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Missing Skills</h2>
          <ul className="mt-3 text-red-500">
            <li>Next.js</li>
            <li>TypeScript</li>
            <li>Testing</li>
          </ul>
        </div>

      </div>
    </div>
  );
}