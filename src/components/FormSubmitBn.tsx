"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./Button";
import Spinner from "./Spinner";

export function SubmitButton({
  text,
  isSubmitting,
}: {
  text: string;
  isSubmitting?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      className="w-full"
      type="submit"
      disabled={pending || isSubmitting}
      variant="solid"
      color="slate"
    >
      {pending || isSubmitting ? <Spinner /> : <>{text}</>}
    </Button>
  );
}
