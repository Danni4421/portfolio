import { Link, useLocation, useNavigate } from "react-router-dom";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface GoToProps {
  to: string;
  className?: string;
  children: ReactNode;
}

export function GoTo({ to, className, children }: GoToProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (to.startsWith("/")) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  const id = to.replace(/^#/, "");

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const scrollTo = () => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (pathname === "/") {
      scrollTo();
      return;
    }

    navigate("/");
    window.setTimeout(scrollTo, 100);
  };

  return (
    <a href={`#${id}`} onClick={handleClick} className={cn(className)}>
      {children}
    </a>
  );
}
