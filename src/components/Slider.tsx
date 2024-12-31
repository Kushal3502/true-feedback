import { cn } from "@/lib/utils";
import Marquee from "./ui/marquee";
import messages from "@/messages.json";

const firstRow = messages.slice(0, messages.length / 2);
const secondRow = messages.slice(messages.length / 2);

const ReviewCard = ({ id, message }: { id: number; message: string }) => {
  return (
    <figure
      className={cn(
        "relative w-64 overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] ",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] "
      )}
    >
      <blockquote className="mt-2 text-base">{message}</blockquote>
    </figure>
  );
};

export default function Slider() {
  return (
    <div className="container relative flex w-full flex-col items-center justify-center overflow-hidden  md:shadow-xl">
      <Marquee className="[--duration:50s]">
        {firstRow.map((message) => (
          <ReviewCard key={message.id} {...message} />
        ))}
      </Marquee>
      <Marquee reverse className="[--duration:50s]">
        {secondRow.map((message) => (
          <ReviewCard key={message.id} {...message} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
