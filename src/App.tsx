import { useState, useEffect } from "react";
import "./App.css";
function App() {
  const [longUrl, setLongUrl] = useState<string>("");
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [originalShortUrl, setOriginalShortUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  interface Url {
    originalUrl: string;
    shortUrl: string;
    createdAt: string;
    visits: number;
    lastVisited: string;
  }

  const [urlsList, setUrlsList] = useState<Url[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Url | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);

  const API_BASE_URL = "http://localhost:7000/";

  useEffect(() => {
    fetchUrlsList();
  }, []);

  const fetchUrlsList = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}api/v1/shortner/list`);

      if (!response.ok) {
        throw new Error("Failed to fetch URLs");
      }

      const data = await response.json();
      setUrlsList(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const shortenUrl = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!longUrl) {
      setError("Please enter a URL");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}api/v1/shortner/encode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: longUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to shorten URL");
      }

      const data = await response.json();
      setShortUrl(data.data);

      fetchUrlsList();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };
  const decodedUrl = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!originalShortUrl) {
      setError2("Please enter your short code");
      return;
    }

    try {
      setIsLoading(true);
      setError2(null);
      console.log("Original Short URL:", originalShortUrl);
      const response = await fetch(
        `${API_BASE_URL}api/v1/shortner/decode?shortUrl=${encodeURIComponent(
          originalShortUrl
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to shorten URL");
      }

      console.log("Response:", response);

      const data = await response.json();
      setOriginalUrl(data.data);

      fetchUrlsList();
    } catch (err) {
      setError2(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatistics = async () => {
    if (searchQuery.length < 3) {
      setError("Search query must be at least 3 characters");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}api/v1/shortner/statistics?shortUrl=${encodeURIComponent(
          searchQuery
        )}`
      );
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error("Failed to get URL statistics");
      }

      const data = await response.json();
      console.log("Data:", data);
      setSearchResults(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>ShortLink URL Shortener</h1>
      </header>

      <main className="main">
        <section className="shorten-section">
          <h2>Shorten a URL</h2>
          <form onSubmit={shortenUrl} className="url-form">
            <input
              type="text"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="Enter a long URL"
              className="url-input"
            />
            <button
              type="submit"
              className="shorten-button"
              disabled={isLoading}
            >
              {isLoading ? "Shortening..." : "Shorten"}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}

          {shortUrl && (
            <div className="result-box">
              <p>Your shortened URL:</p>
              <div className="short-url-container">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="short-url"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={() => copyToClipboard(shortUrl)}
                  className="copy-button"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="shorten-section">
          <h2>Original URL</h2>
          <form onSubmit={decodedUrl} className="url-form">
            <input
              type="text"
              value={originalShortUrl}
              onChange={(e) => setOriginalShortUrl(e.target.value)}
              placeholder="Enter a short URL"
              className="url-input"
            />
            <button
              type="submit"
              className="shorten-button"
              disabled={isLoading}
            >
              {isLoading ? "Decoding..." : "Decode"}
            </button>
          </form>

          {error2 && <p className="error-message">{error2}</p>}

          {originalUrl && (
            <div className="result-box">
              <p>Your Original URL:</p>
              <div className="short-url-container">
                <a
                  href={originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="short-url"
                >
                  {originalUrl}
                </a>
                <button
                  onClick={() => copyToClipboard(originalUrl)}
                  className="copy-button"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="search-section">
          <h2>Get Statistics</h2>
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter the short URL"
              className="search-input"
            />
            <button
              onClick={getStatistics}
              className="search-button"
              disabled={isLoading || searchQuery.length < 3}
            >
              Statistics
            </button>
          </div>

          <div className="search-results">
            <h3>Search Results</h3>
            {searchResults && (
              <ul className="urls-list">
                <div className="url-item">
                  <div className="url-info">
                    <div className="url-row">
                      <span className="url-label">Original URL:</span>
                      <a
                        href={searchResults?.originalUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="url-value"
                      >
                        {searchResults?.originalUrl || "N/A"}
                      </a>
                    </div>
                    <div className="url-row">
                      <span className="url-label">Short URL:</span>
                      <a
                        href={searchResults?.shortUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="url-value"
                      >
                        {searchResults?.shortUrl || "N/A"}
                      </a>
                      <button
                        onClick={() =>
                          searchResults?.shortUrl &&
                          copyToClipboard(searchResults.shortUrl)
                        }
                        className="copy-button small"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="url-stats">
                      <div className="stat-item">
                        Created: {formatDate(searchResults?.createdAt || "")}
                      </div>
                      <div className="stat-item">
                        Visits: {searchResults?.visits || 0}
                      </div>
                      <div className="stat-item">
                        Last Visited:{" "}
                        {formatDate(searchResults?.lastVisited || "")}
                      </div>
                    </div>
                  </div>
                </div>
              </ul>
            )}
          </div>
        </section>

        <section className="urls-section">
          <h2>All URLs</h2>
          {isLoading && <p>Loading...</p>}

          {urlsList.length === 0 ? (
            <p>No URLs have been shortened yet.</p>
          ) : (
            <ul className="urls-list">
              {urlsList.map((url, index) => (
                <li key={index} className="url-item">
                  <div className="url-info">
                    <div className="url-row">
                      <span className="url-label">Original URL:</span>
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="url-value"
                      >
                        {url.originalUrl}
                      </a>
                    </div>
                    <div className="url-row">
                      <span className="url-label">Short URL:</span>
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="url-value"
                      >
                        {url.shortUrl}
                      </a>
                      <button
                        onClick={() => copyToClipboard(url.shortUrl)}
                        className="copy-button small"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="url-stats">
                      <div className="stat-item">
                        Created: {formatDate(url.createdAt)}
                      </div>
                      <div className="stat-item">Visits: {url.visits}</div>
                      <div className="stat-item">
                        Last Visited: {formatDate(url.lastVisited)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} ShortLink URL Shortener</p>
      </footer>
    </div>
  );
}

export default App;
