import Slider from "@/components/Slider";
import { Button } from "@/components/ui/button";
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 py-16">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
          Dive into the World of Anonymous Feedback
        </h1>
        <Link href="/dashboard">
          <Button className=" rounded-full">Get Started &#8594;</Button>
        </Link>
      </div>
      <div className=" max-w-6xl">
        <Slider />
      </div>
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
        )}
      />
    </div>
  );
}
