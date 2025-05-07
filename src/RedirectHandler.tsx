// RedirectHandler.tsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface RedirectHandlerProps {
  API_BASE_URL?: string;
}

const RedirectHandler = ({
  API_BASE_URL = "http://localhost:7000/",
}: RedirectHandlerProps) => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRedirectUrl = async () => {
      if (!shortCode) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}api/v1/shortner/?shortUrl=${encodeURIComponent(
            shortCode
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
          throw new Error(errorData.error || "Failed to fetch redirect URL");
        }

        const data = await response.json();
        window.location.href = data.data;
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    };

    fetchRedirectUrl();
  }, [shortCode, navigate, API_BASE_URL]);

  return <p>Redirecting...</p>;
};

export default RedirectHandler;
