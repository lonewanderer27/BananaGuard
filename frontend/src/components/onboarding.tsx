import { FiUpload, FiZap, FiMessageSquare } from 'react-icons/fi'

const Onboarding = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-12 md:py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">BananaGuard</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          AI-powered banana disease detection and expert insights
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 w-full mt-8">
        <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mb-4">
            <FiUpload size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold mb-2">Upload Image</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload a photo of your banana leaf for quick analysis
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mb-4">
            <FiZap size={24} className="text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold mb-2">Instant Detection</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Our system identifies possible signs of disease and provides helpful insights.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mb-4">
            <FiMessageSquare size={24} className="text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold mb-2">Ask Questions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get educational guidance on prevention and management based on your results.
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 max-w-md mx-auto italic">
          Disclaimer: BananaGuard provides AI-assisted information for educational purposes only.
          It is not a substitute for professional diagnosis or agricultural expert consultation.
        </p>
      </div>
    </section>
  )
}

export default Onboarding;