import useSearch from "@/hooks/use-search";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { message, Select, Space } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Input } from "antd";
const { Search } = Input;

const options = [
  {
    value: "amazon",
    label: "Amazon",
  },
  {
    value: "ebay",
    label: "Ebay",
  },
];


const SearchForm = () => {
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState("amazon");
  const { data, isLoading } = useSearch({ query, target: target.slice(0, 1) });
  const queryClient = useQueryClient();
  const router = useRouter();


  useEffect(() => {
    if (query.length > 3) {
      router.push("/dashboard/search?q=" + query + "&target=" + target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, target]);

  return (
    <div className="relative flex flex-1">
      <Space.Compact>
        <Select
          defaultValue="Amazon"
          onChange={(value) => {
            setTarget(value);
          }}
          options={options}
        />
        <Search
          value={query}
          allowClear
          onChange={async (e) => {
            try {
              await queryClient.cancelQueries({
                queryKey: ["search"],
                exact: false,
              });
              setQuery(e.target.value);
            } catch (error) {
              console.log("error:", error);
            }
          }}
          placeholder="Arbispotter durchsuchen"
          loading={isLoading}
        />
      </Space.Compact>
    </div>
  );
};

export default SearchForm;
