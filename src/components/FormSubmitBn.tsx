'use client'
import { useFormStatus } from "react-dom";
import { Button } from "./Button";
import Spinner from "./Spinner";

export function SubmitButton({ text }: { text: string }) {
    const { pending } = useFormStatus();
    return (
      <Button
        className="w-full"
        type="submit"
      
        disabled={pending}
        variant="solid"
        color="slate"
      >
        {pending ? <Spinner/> : <>{text}</> }
      </Button>
    );
  }