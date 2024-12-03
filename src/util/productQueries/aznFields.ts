import { Settings } from "@/types/Settings";
import { mrgnFieldName, mrgnPctFieldName } from "./mrgnProps";
import { addAznSettingsFields } from "./addAznSettingsFields";
import { marginField, marginPctField } from "./marginFields";

export const aznFields = (
  settings: Settings,
  sdmn?: string,
  isWholesale?: boolean
): any[] => {
  const { a_tptStandard, a_strg, a_prepCenter, fba, euProgram } = settings;
  const transport = settings[a_tptStandard as "a_tptSmall"];

  const match: any = {
    a_pblsh: true,
    ...marginField({ target: "a", settings }),
    ...(settings.minPercentageMargin > 0 &&
      marginPctField({ target: "a", settings })),
  };
  const isSommer = new Date().getMonth() < 9;
  if (settings.a_cats.length > 0 && settings.a_cats[0] !== 0) {
    match["categoryTree.catId"] = { $in: settings.a_cats };
  }

  if(sdmn){
    match.sdmn = sdmn;
  }

  addAznSettingsFields(settings, match);

  const query: any = [];

  if (!isWholesale) {
    query.push({
      $match: match,
    });
  }
  if(fba){
    // If the user does not use Azn FBA, then the margin is calculated,
    // based on there settings for transport, storage, and preparation center
    query.push(
      {
        $addFields: {
          [mrgnFieldName("a", euProgram)]: {
            $round: [
              {
                $subtract: [
                  "$a_prc",
                  {
                    $add: [
                      {
                        $divide: [
                          {
                            $multiply: [
                              "$prc",
                              { $divide: ["$a_qty", "$qty"] },
                            ],
                          },
                          {
                            $add: [
                              1,
                              { $divide: [{ $ifNull: ["$tax", 19] }, 100] },
                            ],
                          },
                        ],
                      },
                      {
                        $subtract: [
                          "$a_prc",
                          {
                            $divide: [
                              "$a_prc",
                              {
                                $add: [
                                  1,
                                  { $divide: [{ $ifNull: ["$tax", 19] }, 100] },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      "$costs.tpt",
                      "$costs.varc",
                      isSommer ? "$costs.strg_1_hy" : "$costs.strg_2_hy",
                      a_prepCenter,
                      "$costs.azn",
                    ],
                  },
                ],
              },
              2,
            ],
          },
        },
      },
      {
        $match: {
          ...marginField({ target: "a", settings }),
        },
      },
      {
        $addFields: {
          [mrgnPctFieldName("a", euProgram)]: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [`$${mrgnFieldName("a", euProgram)}`, "$a_prc"],
                  },
                  100,
                ],
              },
              2,
            ],
          },
        },
      }
    );
  }else{
    // If the user does not use Azn FBA, then the margin is calculated,
    // based on there settings for transport, storage, and preparation center
    query.push(
      {
        $addFields: {
          [mrgnFieldName("a", euProgram)]: {
            $round: [
              {
                $subtract: [
                  "$a_prc",
                  {
                    $add: [
                      {
                        $divide: [
                          {
                            $multiply: [
                              "$prc",
                              { $divide: ["$a_qty", "$qty"] },
                            ],
                          },
                          {
                            $add: [
                              1,
                              { $divide: [{ $ifNull: ["$tax", 19] }, 100] },
                            ],
                          },
                        ],
                      },
                      {
                        $subtract: [
                          "$a_prc",
                          {
                            $divide: [
                              "$a_prc",
                              {
                                $add: [
                                  1,
                                  { $divide: [{ $ifNull: ["$tax", 19] }, 100] },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      transport,
                      a_strg,
                      a_prepCenter,
                      "$costs.azn",
                    ],
                  },
                ],
              },
              2,
            ],
          },
        },
      },
      {
        $match: {
          ...marginField({ target: "a", settings }),
        },
      },
      {
        $addFields: {
          [mrgnPctFieldName("a", euProgram)]: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [`$${mrgnFieldName("a", euProgram)}`, "$a_prc"],
                  },
                  100,
                ],
              },
              2,
            ],
          },
        },
      }
    );

  }

  
  return query;
};
