import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight transition-colors hover:text-primary"
        >
          <Rocket className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            NASA Explorer
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
