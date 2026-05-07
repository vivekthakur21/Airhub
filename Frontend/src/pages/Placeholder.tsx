import { Link } from "react-router-dom";

const Placeholder = ({ title }: { title: string }) => (
  <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
    <h1 className="font-display text-4xl font-bold md:text-5xl">{title}</h1>
    <p className="mt-4 max-w-md text-lg text-muted-foreground">
      We're working hard to bring you this page. Stay tuned for updates on our hotel booking platform!
    </p>
    <Link 
      to="/" 
      className="mt-8 rounded-full gradient-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-elegant transition-all hover:scale-105 active:scale-95"
    >
      Back to Home
    </Link>
  </div>
);

export default Placeholder;
