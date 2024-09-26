import { aznCategoryMapping, ebyCategoryMapping } from "@/constant/constant";
import { Shop } from "@/hooks/use-shop";
import useShops from "@/hooks/use-shops";
import { Layout } from "@/types/IProductFilterForm";
import { WholeSaleTarget } from "@/types/tasks";
import { UseQueryResult } from "@tanstack/react-query";
import { Form, Select } from "antd";
import React, { useEffect, useState, useMemo, useCallback } from "react";

const CategorySelect = ({
  layout,
  target,
}: {
  layout: Layout;
  target: WholeSaleTarget;
}) => {
  const targets = {
    a: {
      fieldName: "a_cats",
      name: "Amazon",
      categories: aznCategoryMapping,
    },
    e: {
      fieldName: "e_cats",
      name: "Ebay",
      categories: ebyCategoryMapping,
    },
  };

  const fieldName = targets[target].fieldName;
  const name = targets[target].name;
  const [options, setOptions] = useState(targets[target].categories);

  const shops = useShops({ page: 0, pageSize: 100 });

  const addProductCountToOptions = (
    result: {
      label: string;
      value: number;
      total: number;
    }[]
  ) =>
    result
      .filter((a) => a.total > 0 || a.value === 0)
      .map((category) => {
        if (category.value === 0) {
          return {
            label: `Alle Kategorien`,
            value: category.value,
          };
        }
        return {
          label: `${category.label} (${category.total})`,
          value: category.value,
          total: 0,
        };
      });

  const sumCategoryCountCallback = useCallback(
    (target: WholeSaleTarget, shops?: Shop[]) =>
      sumCategoryCount(target, shops),
    []
  );

  const sumCategoryCount = (target: WholeSaleTarget, shops?: Shop[]) => {
    if (!shops) {
      return [{ label: "Alle Kategorien", value: 0, total: 0 }];
    }
    let mapping: { value: number; label: string }[] = [];
    if (target === "a") {
      mapping = aznCategoryMapping;
    } else {
      mapping = ebyCategoryMapping;
    }
    return mapping.map((category) => {
      const totalCategory = shops.reduce((total, shop) => {
        if (shop[`${target}_cats`][category.value]) {
          return total + shop[`${target}_cats`][category.value];
        }
        return total;
      }, 0);
      return {
        label: category.label,
        value: category.value,
        total: totalCategory,
      };
    });
  };

  const optionsWithTotal = useMemo(
    () => sumCategoryCountCallback(target, shops.data),
    [shops.data, target, sumCategoryCountCallback]
  );

  useEffect(() => {
    if (optionsWithTotal) {
      setOptions(addProductCountToOptions(optionsWithTotal));
    }
  }, [optionsWithTotal]);

  return (
    <div className={`${layout === "wide" ? "sm:col-span-3" : "sm:col-span-2"}`}>
      <label
        htmlFor={fieldName}
        className="block text-sm font-medium leading-6 text-secondary-950"
      >
        {name} Kategorien
      </label>
      <div className="mt-2">
        <Form.Item
          style={{ marginBottom: "0px" }}
          name={fieldName}
          rules={[
            {
              validator: (_, value) =>
                value && value.length > 0
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error(
                        "Bitte wähle mindestens Option: Alle Kategorien"
                      )
                    ),
            },
          ]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            options={options}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default CategorySelect;
