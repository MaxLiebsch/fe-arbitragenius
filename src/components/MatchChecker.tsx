"use client";

import Image from "next/image";
import React, { use, useCallback, useEffect, useState } from "react";
import { Button } from "./Button";
import useProductCount from "@/hooks/use-product-count";
import useProducts, {
  ProductPagination,
  ProductSort,
} from "@/hooks/use-products";
import Link from "next/link";
import useProductUpdate from "@/hooks/use-product-update";
import { StarIcon } from "@heroicons/react/24/outline";
import useProductDelete from "@/hooks/use-product-delete";
import { Product } from "@/types/Product";
import { defaultProductFilterSettings } from "@/constant/productFilterSettings";

const MatchChecker = ({ shops }: { shops: any[] }) => {
  const [targetShop, setTargetShop] = useState("a");
  const [selectedShop, setselectedShop] = useState<string>(shops[0].d);
  const [currentProductIdx, setCurrentProductIdx] = useState(0);
  const batchSize = 20;
  const [paginationModel, setPaginationModel] = useState<ProductPagination>({
    page: 0,
    pageSize: batchSize,
  });

  const [sortModel, setSortModel] = useState<ProductSort>({
    field: `${targetShop}_mrgn_pct`,
    direction: "desc",
  });

  const collectionName = `${selectedShop}`;
  const productCountQuery = useProductCount(
    collectionName,
    targetShop,
    defaultProductFilterSettings,
    false
  );
  const productCnt = productCountQuery.data
    ? productCountQuery.data.productCount
    : 0;

  const productQuery = useProducts(
    collectionName,
    paginationModel,
    sortModel,
    targetShop,
    defaultProductFilterSettings,
    false
  );
  const productsCnt = productQuery.data ? productQuery.data.length : 0;
  const productMutation = useProductUpdate();
  const productDelete = useProductDelete();
  const productToCheck = productQuery.data
    ? productQuery.data[currentProductIdx]
    : null;

  const verified =
    productToCheck &&
    productToCheck[`${targetShop}_vrfd.vrfd` as keyof Product];
  const hasBsr =
    productToCheck &&
    targetShop === "a" &&
    productToCheck["bsr"] &&
    productToCheck["bsr"].length;

  const handleMatch = useCallback(
    (isMatch: boolean = false) => {
      setCurrentProductIdx(currentProductIdx + 1);
      if (productToCheck && !verified) {
        productMutation.mutate({
          domain: collectionName,
          productId: productToCheck._id.toString(),
          update: {
            [`${targetShop}_vrfd.vrfd`]: isMatch,
            [`${targetShop}_vrfd.vrfn_pending`]: false,
          },
        });
        if (currentProductIdx > productsCnt - 2) {
          setPaginationModel({
            page: paginationModel.page + 1,
            pageSize: batchSize,
          });
          setCurrentProductIdx(0);
        }
      }
    },
    [
      productToCheck,
      productsCnt,
      verified,
      targetShop,
      collectionName,
      currentProductIdx,
      paginationModel.page,
      productMutation,
    ]
  );

  const handleDelete = useCallback(() => {
    if (productToCheck) {
      setCurrentProductIdx(currentProductIdx + 1);
      productDelete.mutate({
        domain: collectionName,
        productId: productToCheck._id.toString(),
      });
      if (currentProductIdx > productsCnt - 2) {
        setPaginationModel({
          page: paginationModel.page + 1,
          pageSize: batchSize,
        });
        setCurrentProductIdx(0);
      }
    }
  }, [
    productDelete,
    setCurrentProductIdx,
    currentProductIdx,
    collectionName,
    productsCnt,
    productToCheck,
    paginationModel.page,
  ]);

  const resetBsr = useCallback(() => {
    if (productToCheck)
      productMutation.mutate({
        domain: collectionName,
        productId: productToCheck._id.toString(),
        update: {
          bsr: [],
          a_props: "incomplete",
          asin: "",
        },
      });
  }, [productMutation, productToCheck, collectionName]);

  const deleteTargetShop = useCallback(() => {
    if (productToCheck) {
      setCurrentProductIdx(currentProductIdx + 1);
      const update: { [key: string]: any } = {};
      if (targetShop === "a") {
        update["a_props"] = "incomplete";
        update["asin"] = "";
        update["bsr"] = [];
      }
      update[`${targetShop}_vrfd.vrfd`] = false;
      update[`${targetShop}_vrfd.vrfn_pending`] = false;
      update[`${targetShop}_lnk`] = "";
      update[`${targetShop}_img`] = "";
      update[`${targetShop}_nm`] = "";
      update[`${targetShop}_mrgn`] = 0;
      update[`${targetShop}_fat`] = false;
      update[`${targetShop}_mrgn_pct`] = 0;
      update[`${targetShop}_prc`] = 0;
      update[`${targetShop}_hash`] = "";

      productMutation.mutate({
        domain: collectionName,
        productId: productToCheck._id.toString(),
        update,
      });
      if (currentProductIdx > productsCnt - 2) {
        setPaginationModel({
          page: paginationModel.page + 1,
          pageSize: batchSize,
        });
        setCurrentProductIdx(0);
      }
    }
  }, [
    productMutation,
    productToCheck,
    collectionName,
    productsCnt,
    targetShop,
    currentProductIdx,
    paginationModel.page,
    setCurrentProductIdx,
  ]);

  useEffect(() => {
    setCurrentProductIdx(0);
    setPaginationModel({ page: 0, pageSize: batchSize });
  }, [selectedShop, targetShop]);

  useEffect(() => {
    document.onkeydown = checkKey;

    function checkKey(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowLeft":
          handleMatch(true);
          break;
        case "ArrowRight":
          handleMatch(false);
          break;
      }
    }
    return () => {
      document.removeEventListener("onkeydown", (e) =>
        checkKey(e as KeyboardEvent)
      );
    };
  }, [handleMatch]);

  if (productQuery.isLoading || productCountQuery.isLoading) {
    return <>...isLoading</>;
  }

  return (
    <>
      <div className="flex flex-row gap-2 items-center">
        <div>
          <label
            htmlFor="source-shop"
            className="block text-sm font-medium leading-6 text-gray-900 sr-only"
          >
            Source Shop
          </label>
          <select
            id="source-shop"
            value={selectedShop}
            onChange={(e) => setselectedShop(e.currentTarget.value)}
            defaultValue={shops[0].d}
            name="source-shop"
            className="mt-2 block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            {shops.map((shop) => (
              <option key={shop.d}>{shop.d}</option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="target-shop"
            className="block text-sm font-medium leading-6 text-gray-900 sr-only"
          >
            TargetShop
          </label>
          <select
            id="target-shop"
            value={targetShop}
            onChange={(e) => setTargetShop(e.currentTarget.value)}
            defaultValue={shops[0].d}
            name="target-shop"
            className="mt-2 block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="a">Amazon.de</option>
            <option value="e">Ebay.de</option>
          </select>
        </div>
        {productToCheck && (
          <div className="flex flex-row gap-2 w-32 flex items-center ml-auto">
            <StarIcon color={verified ? "green" : "red"} />
            <div className="whitespace-pre">
              {verified ? "Verified" : "Not Verified"}
            </div>
          </div>
        )}
        <div className="ml-auto">
          {currentProductIdx + 1}/{productsCnt} in page{" "}
          {paginationModel.page + 1}
        </div>
      </div>
      <div
        className={`grid ${
          !productToCheck ? "grid-cols-1" : "grid-cols-2"
        } h-[calc(100vh-200px)] gap-2`}
      >
        {!productToCheck ? (
          <div className="m-auto h-full w-full text-center">
            missing Product
          </div>
        ) : (
          <>
            {/* source shop */}
            <div className="h-full">
              <div className="flex flex-row min-h-[112px]">
                <div className="">
                  <h1 className="mt-3 text-lg font-semibold text-gray-900">
                    {productToCheck.mnfctr} {productToCheck.nm}
                  </h1>
                  <h2 className="text-lg font-medium text-gray-600">
                    Preis: {productToCheck.prc.toString()}
                  </h2>
                </div>
                <Button
                  onClick={() => handleDelete()}
                  className="ml-auto mr-8 h-10"
                >
                  Delete
                </Button>
              </div>
              <Link target="_blank" href={productToCheck.lnk}>
                <div className="h-[60%] w-full relative">
                  <Image
                    alt="product image"
                    placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCABGAHgDASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAABwgABQYJBAL/xAA+EAAABAQEBAMGAwcDBQAAAAABBAURAgMGIQAHMUEIEiNREyJhMkJxgZGhFBWxFhczUsHh8CRy8QmCkqLR/8QAGwEAAwEBAQEBAAAAAAAAAAAABQYHCAQDAQL/xAA8EQAABQEFBQQIBQMFAAAAAAABAgMEBREABiExQQcSE1FhFCJxoRUkMlKBkbHwI0JicsE00eEzorLC8f/aAAwDAQACEQMRAD8A4SodIgIQdMBYA2uIMzBZ4gAbe8++DCi0aA+GHhBs4M4j82ezC2l98bOn6ZAeQfDAWhbTRw+462Yfh3N6DSgDyPL0EGHkC+noNtGduwsADhNvRf05BU/GyrmPh45054VxztkBnG1Avdypp4Y+f1sNUiiQEIA8EH8tuVhYd2vZvQL3cA0JqVQoDy8skLM/k7vo4Mw8ur27aABkQqQDyNLCwhpC/wBmfv8AzPYLBbBdRqM5uXpB5mHT4b62CINA+nKPNn28O0k6YqB2gcMu9T3a6/zSzO0iQEAqTyrQahXKlevxsvyfQTADSXfcQDZtf112F++NgTy/AQh6F7e6D/NwHfRom+2GiSqG5uTo3HYIe92Dbcd31vpjfEaAAQheTuD9Md+ULi3KNg8ohpYQHXEdldqgkMYBc/76hp488sfKx1CFy7g0wHIemlBD6WT+Rl4It0Ply9+/6CIjtoz49X7vGD+AN/Rw0f63C+oA4+mHeL5euAPJiuzjy9gb6aNuLD3bHu/d44fwOwuMI3833t8AD00wnq7XKG/qfjv05YZ+GPPKlu4sHgFCBpoIZbmGH85Y4jqhE7LzX/TjuLcv1dvmz+gs3lxQHMv2CLod/d5u2+oelndxAWccdCDGXvlHoNqIA1gEe7Bfe+l2d9MueoFgiHwNh91xD4OA6uF2hH64IsNrO+cKuccB/wBQeYBoOQfQK281ISgez5ct3nTzH4Y1HneoUGAAPR5fUIQtpqINYdQGEWHu74HypQoBzvJbf2RBruFxsHoHzbv0SVaGYBeUzWB4R39HF3vta17YFyzRYQ84eEI6+Xl1D9Q5tWif0HbFLg9pxjmJ6xmIZmrqTr1yCnwsJcQwAHshhTn+nTL/AB588FiiQh5w8CF77XeIGEQsI6j7X1tcBOtUaHn6LMEQgIwhe4+bttfsAaXx0KXKObnHwrMOkOwOz+tr6uDdsBhfpSEObyd9AZm0Dfl2AG/lsI4ul2doZjin+Py/N+zryDTHMMM7LbuLAK93yHGgeGQfQKaW5+LtIgHP0rwv7oaj9LBvpdrhbEwy6/TAefpM7joNhv8AO4MI6APpiYu0bfoxmqY8YRyzNpQoc+eH3Wy4rHd/AvLTqH8lsdabQwEIPJDqH0Eb2a4b/wBtT3TlPwxBB5Nw29WcfdD4O/lBsY+mSMPTBuZmbX6+m4g4iDM2wgw1Mp0I+Fa3l0AR/roH+BCIBDjEt8p9UvF/EHCuACI166/+jWtbUFg2Ad3AcaZhTlzHH54W0FPU5DEEvp35g2C/s7M7tYAD7Dg5IFLQjydMBuDuEIMLs/8AcWftbCzTMxMxVCu6joDJ/LxEqk9QZZGMVmvVlVM6lEIudXk2FYSadRfwCMuHlJWMpc4udMGpkgsnJ0E6TKNR85mTHgmonEyWMUAjKKFl0qKGbi3mgeyQKZSG1ckTmE80USVPN1CRUqslljKfDSqEklZq8YqgoUMSp6VEU5CMo4aErIht5IK+jpJsq0atVxegxU4JJqH7THtpRkeRjn002PIFWg4x1HIqPwkpUjRgiyAjly4RSVSMoxtHDAhjFUOcnD4obwt1xIqdJQqSqSB+HuuFiKmKnwUROqZQRIQpjFMBWxRKOhi5OkA2AX5b+YPQNwB9GAPrgrJdDwx8vSd2H2R9B+TfN2EAiaHCTZGhm/DmHxmGqIpSjFzMspXuScc+k6mqxURaTkmjGSdGGqhIEajIoCsbi8CdGalJM6ajyJJ6aMmcdElBHMigM1NZ8UfmxVXC1Gt5OwJ9eBxK5m5N1Gh1EtxmVbJPNGhsr6uP1FEkqSNLhSKtlnEmKRIIHooJZA4jL8k/DIKqUmGUVhl67sXnRdvuwu0paPjoJlNSTmNdwqr2PM/2cl2hpdqiF51u7JE9nK5jiT28LJ0doqLQi0iuyhnbExeMzET4pDIqKuToJEWI4BNUE5X0WbdXK3MQVt/cVM2EOKQDgB91Iqq5GuKZfjEANIH/AMQHb4B5e+l9WidrT93oiH8HZhHls7gFx9N39PewAuFziwrziRrimpKOkcMFKUevL9SEZ+Xy3xDTjfFEiJVOH1VIMTVjKApRcqUQqCaZS4FIygmleSKYlG4RnHZ8cqGcZuFzi1zfX5tTVnknkNl1VWTdO5mVTlLSSpmDneTy6zH4iK4oX85gq1HyCpCdSqunLZorPpyoytOFFdcLqNVxIxuaSIlPANSi0rkrnbVWN4n12nrOGYykY3arynpC+F1Y5hHLvnT5mzjHUu+mUIv0s6Xi5IUWCTxVYzSNkZOgRcc+fNjSL+FUaJO01F1UVjnIjwmDxVVUqRUVFFiIJNzrcEhVkQMqJCFBRZFGvGVSTMTztABDAIeBzB/sZtWYWaId2YHYNgccIq0MEIRdJ2hF/LoLiIg+lvgAjoGA+Q45czszqETM+cpOHmkpmQq6fVUqhJGamdSHl1nbnUfpUuqGa5kZQUJAjLyEsH6bjQajKlkU9VUtSqGbTqlNJSy8sYvw2TR+Ihbr3i6piZlrTWY+ZOTWavC7kjXKYSSjaAmJGXMFb5kVsSPV/ViJUFQJkcqcVTJBckuwU9KXFkYEeMqWLG4JRbxGuO2f7UmBZk822ioo13o+UcyiSt5ruujR0nCumrZ/dyZOyll0oGeTMq6IWPmDs1lHkXLRSRTy0ZIMm3CrJwyotwbnWW7SqgRAQaOycVFchjpu24KIEFw2ECkHitwUAqayC47qKySh9ut0dCARNK9Btr6jbVx/7vL8MBtfpUA52khoIaA49mAf7tq2r/GUeZtYm84OKqlKrp+tluiKOztrGEtmWfU0SdQ9A0+i0FSCpDR8JQ2uBUcmOCdGaU4JKWgGEyWCvDOmGwjExBJX1U4psxVSPLSqimSafFl3nRUv5JlmkQ1qMzOSpkOOCabGuoaNlU9Mp9Op+QkwQrihKUaqLwJibNLTlBVLAaKDNs93bn359JKsGoxb4raLgpMzsJ6FZtzlnIBa8bVmTtsigcJFKMZyLpywOUjts0YLPnKSDJRBZUC6fx3DKqpxk95ZyiBOzrnMHZ3RWx1B4aRw4QrKIkIoFSHOqCZBOoU5S2tQ00Ac7S7NFs7OO7aBD9ghitsAIqOn4Q5+mAXELQ2EbAICwvr8wtpsdUzMA7mBX2YSGg0zDDQWXqko0coVybUAlGFfMRLmJkSvT6MgfhfGiSkKQaMlVJdNGpUM9WlQFE4sYkQTTYUNSpsIeIIQ3HaH7+sTPfT4CFsWGCfSkS5bs5IoIOjtWbszcHCC6qKTxBJy3I5Kgop2ZyKKqairNxw3TYTgk5RRWA6YAXKSSxDKJVMQDnT3t0xSmFMwkOYgmAonJvAYAULvEPSpDHLQRS2o0OEOfpgGoADtqOuo676dw1DEwTKlIw9Ty37ts7g7WFnAOa1vheY0NDzqos06n5a9Sdefl4Yq67YOIOHl8dKfPXDla1piKF5YjoDPbQR3+waWBw+bFUvFD0xtoFn9oez8ri19NB0CwYVSmVEA5BcAuF39Nb/TbuGjYYOmVSEAl+YLcoALvfUBuwAPd+wO1sSC+rFYeNQoj7Q5Dj1z6B9iNjkeoXu40y86c8M9QpW1wapQpSWakGYFO52IOWJmsZ1NzsxaQqsqgqyZXRGl4JSeWOJAKqwjKNMrIIBaejzVdPmHyU6UXKTjCZHPIxTZhEoPI2mS2YyJUJfN2ljh5I4ka5z7jQZUogJ+dKzCy4MIRWlfJUUybJnEyEg3UEpYiKxQqRArOGWllpMuabl+cigoyysFlw5ONgckAgckEqYW8CH9nFJRVCIhDNKTJnUMqc+E203qS5ciGV4McEccempjIehZSAUpeYtVVOR01OPpiJK/GoxY2iSF1ZR1up5pJRJIhY3NM1KdRpUlRMKE05EWTjZ9LR/ysgbikQSeYvGoiwO3WvJIRzlSGTu69WRu1CO1nMOrHOozgqORYpvXvolksnGtCPn4uSRhziwkWno1hGOTaDQDKlOVokqUHAu0ymduUykcAqmtvATiCmnxlCiqoKSYFFUKKpH4yqxDXFlSq1FmVWmZ3DHxNU1llU1Wp9NSs3kWZSlK5w0uqmUVMjTqWqqJIiqRCP0lUUhBhjKxHQUZqZUBFPIQm0wYykZuK6yRyZyLLJXDjWyDxGoysby7zPrHijzEqmvjqMVqrNlZzOo09RSnViyQmrKTHQaebjqmn5yXAbTTEogmykJBMyPx5sTsWoyroemKEqWoaoSDinON1JPUZ4lDsSXEUSvzqoVKqlaQmTCqWVUwLHFpUnz/AMOfUT8gpJklpBCWWhhnxGfcncN9CzphaaFcZghLJU7TNNpRE4Zo1XTkkrSpDLconzSBdWow7ESnzjWVdKrZqMlOJjAviqK6cKecnko07Pcrew/CkYFe+crHRKcbGRrKVb3Su16XkoobtSl1nsJeB+jd803NpRsLLrR8CMpJuG0K3SBOOIoozi3SDQiyLVJyVggqsKyqqiB3zvgIr9rQepuGyRnQNm5lV0AVc8JEpnBjVVEAOsQ17l7wnLGe2clK5k1lxK5D18kZI570pmapx5OcMlKUHmGp1xS5BMralkFZzik1tUh4ygKSZUiCbqsU4kcgqZJnTUWI6TnTTUwjVcLeUNd518ENDpNEZ6UxkemUxnrxeqdZVOdytpnMSr00qdz4zUIQK+X1R1KuphXKWrkyn1CoZBauJKesHiJNeiNF5EqEt/qWhy5pWm6HpOpaNl1BV9QpdXlEwmum19fD8+MAn5c0rllONyl9CKoSuWUlNEpEgon1KSbgPS140fPpM9MkxFCZJH/+nzw9VnlBkbxRZP5y06bpFHzjzUzHFMLkqrR1paO5c1TSpGjyih+0qXUFUHYVSakl5gyTC4YhWS5jlNHS8w3HPnzlA96X83ca+7xa/cQxfXFvXsee3AgntwNnQIvokrO/sDe00ZdL0XFQ8y6jzX0eyi4u7tSR2yEfFlWelE7Z217yskkH7AoR65ySDGdTkl05OU3iLCrEuGQKvuOu4blVKwIiBU3SW+J1zFINFCG0ocGtJ0NRyJk3kLx+0zRvDWq/tYuULRq5S+UuZuZlIlTqWulM1D+RmdqrUJQ9TUKtJm1oYV1gpS66bpH8wqUwRPFJgnZkNiu8OmX35jlsp8GvETTmV+YGVOTKDlHDGRL0nnSi1nkwnfh1amSdcUrGupR2ebLKRyQtotcpiunHAiXj4TIVEkrSZEvdVHwwZdrJUyVP19mbMkHiKoWVZMk5QxcsoHlaVWBM6uiSl0KBEkvTkms1BFnKacWKmziUmoco9NMmCZsyobGZTlNI9Yzq4JHFP82mQ1vLEtMnkhTWr4zl8aWBCTKIyzDlo8tUCWmiJppEmepwGANjOKCS/Cm0CdcqouibQZW8D4xZ52+CQuDctFjPSj5NVMzm/TU12EUdoLuYScrEcyt7EpKQbv1Hk8ZUH8i4RJ8LGNigYgxiLZMBbET4cnICo1RSEggSNODwTRhEDEKJEGRkkzpgRtThIlMKh1LlmjU7mlU2YGX/ABH0bTtJ5jVWlF8+8r11MpKqqWrmtExMJoy4FPnDNSkFHL2rqipxMBNWk2VNXZE+GVKOz0eOcRlx4XqjsrVrLZURKVovikp1ayeoBcUZCRl4sUlSFR1khI5MxIIG6BjzF/aOE8XII89cTksDE6n4F5OknktGnGglmSkMZ1qjhuoKclm0UtV1epqbOLTUwCxA/TMMUtD/AACqRIok2aapU1MUyqT+dKJpMMLQqagXNGpxmI5MMzJs6MWq2UKQnrqCeLr6sdT0qqzNUGiylOToIPCkl5c9MplKTUlHTU1ORIqnKU9V6jFIgkGDK3RqDMmgainHpsN7u3PtlI48eF8jyKC0W3j1UZW4F1llnTeFjHDKFVXcOoRc602zj3LmFjJhR6MrHMVEo9tKEZFImRadtjgtxRYAkYqxlSmRk3pSkM4WTUXKQpHBQBuoqQi6yBUwRVVAVDIipUxstReWY5XyMyZM1alrX7d5t1/mdBFLIRJ/5ZLrZRlKECLFDEcN/io03wxlRH4Yi0Jt+f8ACF7wYyFTxQdTQbC7iIs/Zn2D7Wu4AW6mWIYvEEY9xe4/L+vdrjzPovtTKgD4nmARvft23YG1cd23GLFFu8eUmH55OSUFw+dGSO4WBNJEDmImkmUeGiRJIlCJlLQhChhUcRERFugRQTKikG6mngQu8JqFEa+0YRMOIiNRrTKwdqeKDqeyIiA/ew2Bxt8NxAMTGdqdSliE4eYB1YRs4fK23672CY0hDsVexJhum006ED6fUByrRUXVDiDl86B99NLCim14AGAOfYA1YB1C7jYWvvuHpg8U7UbeH1A90LDb6uFrOD9vjhCUCqYQ5B5+wav6A/u6/B3e+5qQqtCEIA8V9NxAP1h013H0th3vZcs6gqVSHUAwzy+/vAaykADd72ga6CNKdQs/9P1OABB1AAQ9b3HZxD1FrtqHbBrQashh5A8ULsDP2f11/wA0G3PhErEA5OqD2s7atb2n+/2EMFhIrgIeTrbw35tg9HAL/G22wRZtvNs+OoY9UBxEfy/tHUK69M+lmxnJgUC0PlkNc6Ur8OtcA526HotaBDDC85wAA1i0ENr/AA7iGlsE1NrwIeXrCHZomewe0/ewP9Xdh53pddty9YNQ95nAHtC4xPdx2+IY3ZKv+UA6+38zB87PvoHpbELmtl5lDHq3rXD2QHOnTnQfPGzG3mACneDTWvu1riGnOmvw6FFcwYQhDr2ABC8QP89QERAO3tPyviy/eGLMM8L9ovtdtGuz+gsOEHkZhBbr9gARiG/zfv7v0bHs/eHZvHG1va94Qd9XFhDtYLYRF9kdTibs1R3vc6h05Z60pjQaWJFnAAA7+NA1p7vh9461B2TeYPMEXXHQffDUQHZ4XhBg3G7aWEMWp12EQRPOdwiGwvaG1h1tt21sI4U0xmE4XngL7u4u+1/nzXfbds0er9wj6+8XvcultHF9bdr3wVjtlAkMX1amWG5TlqAW51ZvD2+oY9C+P2IDjhZiVmtAjCIPGB9Q8w2/4uG43G+BAvVdDEEfVB3H3hu73922oA4MIeoQhgNKldhEETzxFwiYeYdXENREfT/cGBor1sAhG00BBhs7+YQHS4//AEbPiuXd2bHTEg8AcN38v7ApWmWfwxsEdSwCA94a0pj4F6/5sRagqiCLxOozgIcoRfb5jZ/RwDbANqKowHn8+12H4ts3m0H56jjKLVZBEEzrau3muAsP8wj9huGmmA4u1a4zOr9RAPk1we7frjQl1LiHIKX4Ih7Og5DSuAc6gAdbLDyRAajXnXHwH+fniOGFrWo6gAQjHxO+jBtsA93Ae4gNtXxML/UFUwjz9QHv8X7u4O9t9fjiY0JFXPOVomHBEcA0H9OHl8vDFXWfhv1r91Aen2NdK2WxDqUw0AtEAAIcwAOv/s2gB/lsF5GqkwHh+3YYXuGziN3cdbPve2JiYtN5GDMd+rdP5D+jr1GwJooeod4dP+ViskVWZaFgjAGB7g7DsAuOu/8AzzElLq8zywWmfUO1wbmbe2+JiYhk7HMRMcBbJ0oOg+6HWzE1UP3e8On/AFtviFXmwb27CG4Dvfdr641pWszfKAtHYHZw0+PNr6WD+kxMS6SjGHeHsqVedB/vYsispQB3xxEOXIv9gteyq0NtpMsAxahuwW83oI93FnbHqirQ6FvO4buA6i46xfBtnDTExMKx4yPEf6VLMdB5F627iqqUDvjnT5CQPv5528k+tDrADRs4C3MA9+46fXtikN1mbiAXCNghF/MF7OO/f/nExMd7OMj94vqqXyH9PW3kZZURDvm0+pA+lsieq81EMQdRwfcGfXR/T/NsCqVcaaIGjZoh1D+UBGz2EQa7jfbExMP0PGsKk9VSx3RyHOodbDHCqnvmwEfIQAPLDwsNFerDLRP4m24P5Ym1d/v+thWs1OYHmFotw1/uHfTT7YmJiyXej2VSerp5k0Hp1sBcqqCA1OOYedhAuVOYHncI/MEW4DYImF3Hcb9+44mJiYtccxaA1JRAmnP3Sjz52XllVN/2xyD78gt//9k="
                    className="object-contain"
                    fill={true}
                    src={productToCheck.img}
                  />
                </div>
              </Link>
            </div>
            {/* target shop */}
            <div>
              <div>
                <div className="flex flex-row min-h-[112px]">
                  <div>
                    <h1 className="mt-3 text-lg font-semibold text-gray-900">
                      {
                        productToCheck[
                          `${targetShop}_nm` as keyof Pick<
                            Product,
                            "a_nm" | "e_nm"
                          >
                        ]
                      }
                    </h1>
                    <h2 className="text-lg font-medium text-gray-600">
                      Preis:{" "}
                      {
                        productToCheck[
                          `${targetShop}_prc` as keyof Pick<
                            Product,
                            "a_prc" | "e_prc"
                          >
                        ]
                      }
                    </h2>
                  </div>
                  <Button
                    onClick={() => deleteTargetShop()}
                    className="ml-auto h-10 min-w-48"
                  >
                    Delete target shop
                  </Button>
                </div>
                {hasBsr ? (
                  <div className="flex">
                    <span className="font-semibold">BSR:</span>
                    <span className="">
                      {productToCheck["bsr"].map((bsr: any) => {
                        return (
                          <span
                            className="mx-1"
                            key={bsr.number + bsr.category}
                          >
                            Nr.{bsr.number.toLocaleString("de-DE")} in{" "}
                            {bsr.category}
                          </span>
                        );
                      })}
                    </span>
                    <Button onClick={() => resetBsr()} className="ml-auto">
                      Reset BSR
                    </Button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <Link
                target="_blank"
                className=""
                href={productToCheck[
                  `${targetShop}_lnk` as keyof Product
                ].toString()}
              >
                <div className="h-[60%] w-full relative">
                  <Image
                    alt="product image"
                    placeholder="data:image/jpeg;base64,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"
                    className="object-contain"
                    fill={true}
                    src={
                      productToCheck[
                        `${targetShop}_img` as keyof Product
                      ] as string
                    }
                  />
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="grid grid-cols-2">
        {productMutation.isPending ? (
          <>...isLoading</>
        ) : (
          <>
            <Button onClick={() => handleMatch(true)}>
              {verified ? "Continue" : "Arrowkey: left, Match"}
            </Button>
            <Button onClick={() => handleMatch(false)}>
              {verified ? "Continue" : "Arrowkey: right, No match"}
            </Button>
          </>
        )}
      </div>
      <div className="hidden sm:block mt-10 flex justify-center h-full">
        <p className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-medium">{paginationModel.page + 1}</span> to{" "}
          <span className="font-medium">
            {Math.ceil(productCnt / batchSize)}
          </span>{" "}
          of <span className="font-medium">{productCnt}</span> results
        </p>
      </div>
    </>
  );
};

export default MatchChecker;
