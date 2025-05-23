import { PRODUCT_COL } from "@/constant/constant";
import { getLoggedInUser } from "@/server/appwrite";
import { getProductCol } from "@/server/mongo";
import clientPool from "@/server/mongoPool";
import { ProductUpdateSchema } from "@/types/ProductUpdate";
import { resetAznProductQuery } from "@/util/aznQueries";
import { calculateAznArbitrage } from "@/util/calculateAznArbitrage";
import {
  calculateEbyArbitrage,
  findMappedCategory,
} from "@/util/calculateEbyArbitrage";
import { resetEbyProductQuery } from "@/util/ebyQueries";
import { roundToTwoDecimals } from "@/util/roundToTwoDecimals";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { domain: string; productId: string } }
) {
  const user = await getLoggedInUser();
  if (!user?.labels.includes("admin")) {
    return Response.json("unauthorized", { status: 401 });
  }

  const { domain, productId } = params;
  const client = await clientPool["NEXT_MONGO_ADMIN"];

  const body = await request.json();

  const form = ProductUpdateSchema.safeParse(body);

  if (!form.success) {
    return Response.json(form.error, { status: 400 });
  }
  const col = client.db().collection(PRODUCT_COL)

  const product = await col.findOne({ _id: new ObjectId(productId) });

  if (product === null) {
    return Response.json("Product not found " + productId, { status: 404 });
  }
  const { costs, e_pRange, a_prc, a_avg_price, prc, ebyCategories } = product;
  const medianPrice = e_pRange?.median!;
  const aznSellPrice = a_avg_price || a_prc

  const {
    asin,
    originalAsin,
    eanCorrect,
    esin,
    originalEsin,
    originalEQty,
    aTargetCorrect,
    eTargetCorrect,
    e_qty: eSellQty,
    qty: buyQty,
    sourceOutdated,
    a_qty: aSellQty,
    originalAQty,
    originalQty,
  } = form.data;

  let query: { [key: string]: any } = {};

  if (
    (buyQty > 0 && buyQty !== originalQty) ||
    (aSellQty > 0 && aSellQty !== originalAQty) ||
    (eSellQty > 0 && eSellQty !== originalEQty)
  ) {
    query["$set"] = {
      ...(buyQty > 0 &&
        buyQty !== originalQty && {
          qty: buyQty,
          uprc: roundToTwoDecimals(prc / buyQty),
        }),
      ...(aSellQty > 0 &&
        aSellQty !== originalAQty && {
          a_qty: aSellQty,
          a_uprc: roundToTwoDecimals(aznSellPrice / aSellQty),
        }),
      ...(eSellQty > 0 &&
        eSellQty !== originalEQty && {
          e_qty: eSellQty,
          e_uprc: roundToTwoDecimals(medianPrice / eSellQty),
        }),
    };
  }
  if (!eanCorrect) {
    const resetAzn = resetAznProductQuery();
    const resetEby = resetEbyProductQuery();
    let unset = { $unset: { ...resetAzn.$unset, ...resetEby.$unset } };
    query = {
      ...unset,
      $set: {
        ean_prop: "invalid",
      },
    };
  } else {
    if (sourceOutdated) {
      query["$set"] = {
        ...(query?.$set ?? {}),
        a_pblsh: false,
        e_pblsh: false,
      };
      query.$unset = {
        dealAznUpdatedAt: "",
        dealEbyUpdatedAt: "",
      };
    } else {
      if (esin !== originalEsin) {
        const resetEby = resetEbyProductQuery();
        delete resetEby.$unset["esin"];
        delete resetEby.$unset["e_qty"];
        query = {
          $unset: { ...resetEby.$unset },
          $set: {
            esin,
            e_qty: eSellQty,
            qty: buyQty,
          },
        };
      }
      if (asin !== originalAsin) {
        const resetAzn = resetAznProductQuery();
        delete resetAzn.$unset["asin"];
        delete resetAzn.$unset["a_qty"];
        query = {
          $unset: { ...resetAzn.$unset },
          $set: {
            asin,
            a_qty: aSellQty,
            qty: buyQty,
          },
        };
      }
      if (!aTargetCorrect) {
        const resetAzn = resetAznProductQuery();
        query = {
          $unset: { ...resetAzn.$unset },
        };
      }
      if (!eTargetCorrect) {
        const resetEby = resetEbyProductQuery();
        query = {
          $unset: { ...resetEby.$unset },
        };
      }
      if (costs && asin === originalAsin && aSellQty !== originalAQty) {
        const { prc, costs, tax } = product;
        const result = calculateAznArbitrage(
          prc * (aSellQty / buyQty), // EK
          aznSellPrice, // VK
          costs,
          tax
        );

        query["$set"] = {
          ...(query?.$set ?? {}),
          ...result,
        };
      }
      if (
        ebyCategories?.length &&
        esin === originalEsin &&
        eSellQty !== originalEQty
      ) {
        const mappedCategories = findMappedCategory([ebyCategories[0].id]);
        if (mappedCategories) {
          const ebyArbitrage = calculateEbyArbitrage(
            mappedCategories,
            medianPrice, // VK
            prc * (eSellQty / buyQty)
          );
          if (ebyArbitrage) {
            query["$set"] = {
              ...(query.$set ?? {}),
              ...ebyArbitrage,
            };
          }
        }
      }
      if (buyQty !== originalQty) {
        const { prc, costs, tax, ebyCategories } = product;
        if (aTargetCorrect && costs && asin === originalAsin) {
          const result = calculateAznArbitrage(
            prc * (aSellQty / buyQty), // EK
            aznSellPrice, // VK
            costs,
            tax
          );
          query["$set"] = {
            ...(query?.$set ?? {}),
            ...result,
          };
        }
        if (
          eTargetCorrect &&
          esin === originalEsin &&
          ebyCategories?.length > 0
        ) {
          const mappedCategories = findMappedCategory([
            product.ebyCategories[0].id,
          ]);
          if (mappedCategories) {
            const ebyArbitrage = calculateEbyArbitrage(
              mappedCategories,
              medianPrice,
              prc * (eSellQty / buyQty)
            );
            if (ebyArbitrage) {
              query["$set"] = {
                ...(query?.$set ?? {}),
                ...ebyArbitrage,
              };
            }
          }
        }
      }
    }
  }

  if (Object.keys(query).length === 0) {
    return Response.json({ acknowledged: true });
  }

  const res = await col.updateOne({ _id: new ObjectId(productId) }, query);

  return Response.json(res);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { domain: string; productId: string } }
) {
  const user = await getLoggedInUser();
  if (!user?.labels.includes("admin")) {
    return Response.json("unauthorized", { status: 401 });
  }
  
  const { domain, productId } = params;
  const client = await clientPool["NEXT_MONGO_ADMIN"];
  const col = client.db().collection(PRODUCT_COL);

  const res = await col.deleteOne({ _id: new ObjectId(productId) });

  return Response.json(res);
}
