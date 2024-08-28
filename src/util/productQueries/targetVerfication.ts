export function targetVerification(
  findQuery: any[],
  target: string,
  targetVerificationPending: string | null
) {
  if (targetVerificationPending) {
    findQuery.push({
      $and: [
        {
          [`${target}_vrfd.vrfn_pending`]: targetVerificationPending === "true",
        },
      ],
    });
  } else {
    findQuery.push({
      $or: [
        {
          $and: [
            {
              [`${target}_vrfd.vrfd`]: true,
            },
            {
              [`${target}_vrfd.vrfn_pending`]: false,
            },
          ],
        },
        {
          $and: [
            {
              [`${target}_vrfd.vrfd`]: false,
            },
            {
              [`${target}_vrfd.vrfn_pending`]: true,
            },
          ],
        },
        {
          [`${target}_vrfd.flag_cnt`]: { $lt: { $size: 3 } },
        },
      ],
    });
  }
}
