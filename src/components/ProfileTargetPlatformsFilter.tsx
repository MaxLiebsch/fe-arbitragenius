"use client";
import React, { use, useRef, useState } from "react";
import { Checkbox, Form } from "antd";
import { useForm } from "antd/es/form/Form";
import { useUserSettings } from "@/hooks/use-settings";
import { SubmitButton } from "./FormSubmitBn";
import { updateTargetPlatformsAction } from "@/server/actions/update-platforms";
import Spinner from "./Spinner";

const ProfileTargetPlatformsFilter = () => {
  const [form] = useForm();
  const formRef = useRef(null);
  const [settings, setUserSettings] = useUserSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateTargetPlatformsState, setUpdateTargetPlatformsState] = useState<{
    message?: string;
    fieldErrors: {};
    error?: string;
  }>({
    message: "",
    fieldErrors: {},
    error: "",
  });
  const { error, message } = updateTargetPlatformsState;
  const options = [
    { label: "Amazon", value: "a" },
    { label: "Ebay", value: "e" },
    { label: "Kaufland (Coming soon)", value: "k", disabled: true },
  ];

  const onFinish = async (values: any) => {
    setUpdateTargetPlatformsState({ message: "", fieldErrors: {}, error: "" });
    setIsSubmitting(true); // Set the submission state to true
    try {
      // Simulate an async operation (like an API call)
      const updateTargetPlatform = await updateTargetPlatformsAction(values);
      const targetPlatforms = updateTargetPlatform?.targetPlatforms;
      if (targetPlatforms) {
        setUserSettings({
          ...settings,
          targetPlatforms: targetPlatforms.targetPlatforms,
          loaded: true,
        });
      }
      setUpdateTargetPlatformsState(updateTargetPlatform);
    } finally {
      setIsSubmitting(false); // Reset the submission state
    }
  };

  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-6 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-secondary-950">
          Zielplatformen
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-400">
          Hier kannst Du deine Zielplatformen auswählen.
        </p>
      </div>
      {/* Form */}
      {settings.loaded ? (
        <Form
          ref={formRef}
          form={form}
          className="md:col-span-2"
          initialValues={{ targetPlatforms: settings.targetPlatforms }}
          onFinish={onFinish}
        >
          <Form.Item style={{ marginBottom: "0px" }} name="targetPlatforms">
            <Checkbox.Group
              options={options}
              className="rounded border-gray-300 pt-4 text-secondary-950 focus:ring-secondary-500"
            />
          </Form.Item>
          {Boolean(error) && (
            <div className="text-sm text-red-500 text-right">✗ {error}</div>
          )}
          {Boolean(message) && (
            <div className="text-sm text-green-500 text-right w-full">
              ✓ {message}
            </div>
          )}
          <div className="flex ml-auto">
            <SubmitButton text="Speichern" isSubmitting={isSubmitting} />
          </div>
        </Form>
      ) : (
        <div className="flex justify-center items-center md:col-span-2">
          <div>
            <Spinner />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTargetPlatformsFilter;
