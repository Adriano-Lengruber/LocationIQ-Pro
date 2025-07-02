import APIConfigurationStatus from '@/components/APIConfigurationStatus';

export default function APIStatusPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Status das APIs - LocationIQ Pro
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Veja quais APIs estamos usando e como mantemos o projeto 100% gratuito
            </p>
          </div>
          
          <APIConfigurationStatus />
        </div>
      </div>
    </div>
  );
}
