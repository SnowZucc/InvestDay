import React, { useEffect, useState } from "react";
import TableTransactionStyles from "../styles/TableTransaction.module.css";
import { useFetch } from "../context/FetchContext.js";
import { useWallet } from "../context/WalletContext";
import Popup from "./Popup.component";
import Button from "../components/Button.component";
function TableWallet({ selectedId, activeWalletTransactions }) {
  const fetch = useFetch();
  const [symbol, setSymbol] = useState("");
  const [maxCount, setMaxCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { walletsLines, actualiseWalletsLines, valuesCached } = useWallet();
  useEffect(() => {
    if (!(walletsLines && walletsLines[selectedId])) actualiseWalletsLines();
  }, [activeWalletTransactions]);
  function openPopUp() { }

  return (
    <>
      <table className={TableTransactionStyles.transactionTable}>
        <thead>
          <tr className={TableTransactionStyles.tr}>
            <th className={TableTransactionStyles.th}>Libellé</th>
            <th className={TableTransactionStyles.th}>Quantité</th>
            <th className={TableTransactionStyles.th}>Valeur achat</th>
            <th className={TableTransactionStyles.th}>Valeur actuelle</th>
            <th className={TableTransactionStyles.th}>Var $</th>
            <th className={TableTransactionStyles.th}>Var %</th>
            <th className={TableTransactionStyles.th}>Gain</th>

            <th className={TableTransactionStyles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {walletsLines &&
            walletsLines[selectedId] &&
            walletsLines[selectedId].map((item, index) => {
              let value = valuesCached?.[item.symbol]?.value;
              if (value == null) return <></>;
              // averagePriceAtExecution

              let quantityBuy = 0;
              let averagePriceAtExecution = item.valueAtExecution.reduce(
                (acc, item2) => {
                  quantityBuy += item2.quantity;
                  return acc + item2.quantity * item2.price;
                },
                0
              );
              averagePriceAtExecution = averagePriceAtExecution / quantityBuy;

              return (
                <tr key={index} className={TableTransactionStyles.tr}>
                  <td
                    data-label="Libellé"
                    className={TableTransactionStyles.td}
                  >
                    {item?.symbol}
                  </td>
                  <td
                    data-label="Quantité"
                    className={TableTransactionStyles.td}
                  >
                    {item?.quantity?.toFixed(2)}
                  </td>
                  <td
                    data-label="Val moyenne Achat"
                    className={TableTransactionStyles.td}
                  >
                    {averagePriceAtExecution?.toFixed(2)} $
                  </td>
                  <td
                    data-label="Val Actuelle"
                    className={TableTransactionStyles.td}
                  >
                    {value?.toFixed(2)} $
                  </td>

                  <td
                    data-label="Var moyenne $"
                    className={TableTransactionStyles.td}
                  >
                    {(value - averagePriceAtExecution)?.toFixed(2)} $
                  </td>
                  <td
                    data-label="Var moyenne %"
                    className={TableTransactionStyles.td}
                  >
                    {averagePriceAtExecution
                      ? (
                        ((value - averagePriceAtExecution) /
                          averagePriceAtExecution) *
                        100
                      ).toFixed(2)
                      : "-"}{" "}
                    %
                  </td>
                  <td
                    data-label="Gain éstimé"
                    className={TableTransactionStyles.td}
                  >
                    {(
                      (value - averagePriceAtExecution) *
                      item.quantity
                    ).toFixed(2)}{" "}
                    $
                  </td>
                  <td data-label="Action" className={TableTransactionStyles.td}>
                    <Button
                      title={"Vendre"}
                      onClick={() => { setIsOpen(!isOpen); setSymbol(item.symbol); setMaxCount(item.quantity) }}
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <Popup
        title="Vendre"
        subtitle="Quantité"
        sell={true}
        symbol={symbol}
        maxCount={maxCount}
        openDefault={isOpen}
        open={isOpen}
        close = {() => setIsOpen(false)}
      />
    </>
  );
}

export default TableWallet;
