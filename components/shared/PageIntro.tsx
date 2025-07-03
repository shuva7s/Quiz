import { ImageIcon } from "lucide-react";

const PageIntro = ({
  image = "",
  heading,
  description,
}: {
  image?: string;
  heading: string;
  description?: string;
}) => {
  return (
    <section className={`my-5 ${image && "-mb-3"}`}>
      {image && (
        <div className="w-full aspect-square max-h-100 fl_center bg-primary/30 mask-b-from-75%">
          <ImageIcon className="size-10 text-white" />
        </div>
      )}
      <div className={`py-3 ${image && "px-5 -translate-y-8"}`}>
        <h1 className={`text-primary mb-1 ${image ? "h2" : "h3"}`}>
          {heading}
        </h1>
        {description && (
          <p className="text-muted-foreground text-sm leading-5.5">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};

export default PageIntro;
