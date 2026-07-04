import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-140px)] py-12 text-center">
      <h1 className="text-9xl font-bold text-muted-foreground/20">404</h1>
      <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
      <p className="text-muted-foreground mt-2 max-w-[500px]">
        Sorry, we couldn't find the page you're looking for. It might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button asChild size="lg" className="mt-8 bg-brand hover:bg-brand-dark">
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
}
