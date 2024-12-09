import React, { ReactNode } from "react";
import { Button } from "./Button";
import { CheckIcon } from "./Icons";
import clsx from "clsx";

const Plan = ({
  name,
  price,
  description,
  href,
  features,
  featured = undefined,
}: {
  name: ReactNode;
  price: ReactNode;
  description:  ReactNode;
  href?: string;
  features: Array<string>;
  featured?: string;
}) => {
  return (
    <section
      className={clsx(
        "relative",
        "flex flex-col items-center rounded-3xl px-6 sm:px-8",
        featured
          ? "order-first bg-gradient-to-t from-secondary-800 to-secondary-400 py-8 lg:order-none"
          : "border border-secondary lg:py-8"
      )}
    >
      {featured ? (
        <span className="absolute -right-0 -top-5 md:-right-9 md:-top-6 inline-flex items-center rounded-full bg-gray-50 px-8 py-1 text-lg font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          {featured} 
        </span>
      ) : (
        <></>
      )}
      <h3 className="font-display text-lg text-white">{name}</h3>
      <p
        className={clsx("mt-2 text-xl", featured ? "text-white" : "text-white")}
      >
        {description}
      </p>
      <div className="order-first font-display text-5xl font-light tracking-tight text-white">
        {price}
      </div>
      <ul
        role="list"
        className={clsx(
          "order-last mt-10 flex flex-col gap-y-3 text-sm",
          featured ? "text-white" : "text-primary-200"
        )}
      >
        {features.map((feature) => (
          <li key={feature} className="flex">
            <CheckIcon
              className={featured ? "text-white" : "text-primary-400"}
            />
            <span
              className="ml-4"
              dangerouslySetInnerHTML={{ __html: feature }}
            ></span>
          </li>
        ))}
      </ul>
      <Button
        href={href !== undefined ? href : undefined}
        type="submit"
        variant={featured ? "solid" : "outline"}
        color={"slate"}
        className="mt-8"
        aria-label={`Get started with the ${name} plan for ${price}`}
      >
        Checkout
      </Button>
    </section>
  );
};

export default Plan;
