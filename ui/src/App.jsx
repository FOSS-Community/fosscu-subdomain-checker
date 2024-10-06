import { useState } from 'react';
import { Search, Check, X, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SubdomainChecker = () => {
  const [subdomain, setSubdomain] = useState('');
  const [isAvailable, setIsAvailable] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSubdomain(value);

    // Clear error when input is empty
    if (!value.trim()) {
      setError('');
      setIsAvailable(null);
    }
  };

  const checkSubdomain = async () => {
    if (!subdomain.trim()) {
      setError('Please enter a subdomain');
      return;
    }

    setIsLoading(true);
    setError('');
    setIsAvailable(null);

    try {
      const response = await fetch(`http://0.0.0.0:8020/check-subdomain/${subdomain.trim()}`);
      const data = await response.json();
      setIsAvailable(data.is_available);
    } catch (err) {
      setError('Failed to check subdomain availability. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <img
              src={"https://fosscu.org/assets/fosscu-b4a2a871.png"}
              height={100}
              width={100}
              className="mx-auto"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            FOSSCU Subdomain Checker
          </h1>
          <p className="text-gray-600 mb-8">
            Check availability of subdomains under fosscu.org
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={subdomain}
                onChange={handleInputChange}
                placeholder="Enter subdomain"
                className="w-full px-4 py-2 border rounded-md pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && checkSubdomain()}
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                .fosscu.org
              </span>
            </div>
            <button
              onClick={checkSubdomain}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              Check
            </button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isAvailable !== null && !error && (
            <div className={`mt-4 p-4 rounded-md ${isAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-2">
                {isAvailable ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-red-600" />
                )}
                <span className={isAvailable ? 'text-green-700' : 'text-red-700'}>
                  {isAvailable
                    ? `${subdomain}.fosscu.org is available!`
                    : `${subdomain}.fosscu.org is not available, and it is already in use.`}
                </span>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Powered by <a href={"https://fosscu.org"}> FOSSCU</a>
        </p>
      </div>
    </div>
  );
};

export default SubdomainChecker;
