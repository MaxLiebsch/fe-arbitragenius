import usePreferences from "@/hooks/use-preferences";
import useRelease from "@/hooks/use-release";
import { Modal, Timeline } from "antd";
import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import Badge from "./Badge";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import useLastAcknowledgedReleaseUpdate from "@/hooks/use-lastAcknowledgedRelease-update";
import { Button } from "./Button";

const ReleaseModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchRelease, setFetchRelease] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    mutateLastAcknowledgedRelease.mutate(process.env.NEXT_PUBLIC_VERSION!);
    setIsModalOpen(false);
  };
  const lastAcknowledgedRelease = usePreferences("lastAcknowledgedRelease");
  const mutateLastAcknowledgedRelease = useLastAcknowledgedReleaseUpdate();
  const release = useRelease({ enabled: fetchRelease });
  console.log("release:", release?.data);
  console.log(
    "lastAcknowledgedRelease:",
    lastAcknowledgedRelease?.data,
    process.env.NEXT_PUBLIC_VERSION
  );

  useEffect(() => {
    if (
      lastAcknowledgedRelease.data !== undefined &&
      lastAcknowledgedRelease.data !== process.env.NEXT_PUBLIC_VERSION
    ) {
      setFetchRelease(true);
    }
  }, [lastAcknowledgedRelease.data]);

  useEffect(() => {
    if (release.data && release.data?.notes && release.data?.notes.length > 0) {
      showModal();
    }
  }, [release.data]);

  return (
    <Modal
      title="Release Notes für Arbispotter App"
      open={isModalOpen}
      closeIcon={null}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      okText="Super, danke!"
    >
      <div className="flex flex-col">
        {release.data && (
          <div>
            <div className="flex flex-row gap-2 items-center">
              <Badge
                color={"gray"}
                text={
                  <h2 className="text-lg font-bold text-gray">
                    {release.data.version}
                  </h2>
                }
              />
              <h2 className="text-lg font-light">
                {format(new Date(release.data.publishedAt), "PPPP", {
                  locale: de,
                })}
              </h2>
            </div>
            <Timeline
              className="!mt-4"
              items={release.data.notes.map((note: any, i: number) => {
                const getColor = (type: string) => {
                  switch (type) {
                    case "added":
                    case "new":
                      return "green";
                    case "fixed":
                    case "improved":
                      return "yellow";
                    case "removed":
                      return "red";
                    default:
                      return "gray";
                  }
                };
                return {
                  color: getColor(note.type),
                  children: (
                    <div key={i}>
                      <div>
                        <Badge text={note.type} color={getColor(note.type)} />
                      </div>
                      <p>{note.text}</p>
                    </div>
                  ),
                };
              })}
            />
          </div>
        )}
        <Button className="ml-auto" onClick={() => handleOk()}>
          {mutateLastAcknowledgedRelease.isPending ? (
            <Spinner size="!h-4 !w-4" />
          ) : (
            "OK, verstanden"
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default ReleaseModal;
