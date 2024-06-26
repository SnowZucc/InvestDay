import Head from "next/head";

import { Inter } from "@next/font/google";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import cash from "src/public/assets/cash.svg";
import total from "src/public/assets/total.svg";
import wallet from "src/public/assets/wallet.svg";
import Button from "../components/Button.component";
import InfoBox from "../components/InfoBox.component.jsx";
import DashBoardLayout from "../components/layouts/DashBoard.layout";
import TableWallet from "../components/TableWallet.component.jsx";
import { useFetch } from "../context/FetchContext.js";
import homeStyles from "../styles/Home.module.css";
import TableTransaction from "../components/TableTransaction.component.jsx"; // Nécessaire pour la liste des transactions

import { useWallet } from "../context/WalletContext";
import { toast } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export default function Wallet() {
  const {
    wallets,
    selectedId,
    selectWallet,
    assetsCached,
    actualiseWalletsList,
  } = useWallet();
  const router = useRouter();

  const fetch = useFetch();
  async function handleNewWallet() {
    const newWallet = await fetch.get("/api/wallet/new");
    toast.success("Nouveau portefeuille créé !");
    actualiseWalletsList();
  }

  return (
    <>
      <Head>
        <title>InvestTrade - Portefeuille</title>
        <meta name="description" content="Portefeuille" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={homeStyles.pageContainer}>
        <div className={homeStyles.headerContainer}>
          <div className={homeStyles.titleContainer}>
            <h1>Portefeuille</h1>
            {wallets &&
              wallets.map((wallet, index) => (
                <Button
                  key={index}
                  title={`${index + 1}`}
                  selected={selectedId === index}
                  onClick={() => {
                    selectWallet(index);
                  }}
                />
              ))}
            {wallets && wallets.length < 4 && (
              <Button title={"+"} onClick={() => handleNewWallet()} />
            )}
          </div>
        </div>
        <div className={homeStyles.contentContainer}>
          <div className={homeStyles.infoBoxContainer}>
            <InfoBox
              title={`Valeur de vos actions portefeuille n°${
                selectedId + 1
              }`}
              desc={wallets ? assetsCached.toFixed(2) + " $" : "$"}
              icon={wallet}
            />
            <InfoBox
              title={`Cash portefeuille n°${selectedId + 1}`}
              desc={
                wallets ? wallets[selectedId]?.cash?.toFixed(2) + " $" : "$"
              }
              icon={cash}
            />
            <InfoBox
              title={`Valeur totale portefeuille n°${
                selectedId + 1
              }`}
              desc={
                wallets != undefined
                  ? ((wallets[selectedId]?.cash || 0) + assetsCached).toFixed(
                      2
                    ) + " $"
                  : "$"
              }
              icon={total}
            />
          </div>
          <div className={homeStyles.tableContainer}>
            <TableWallet
              selectedId={selectedId}
              activeWalletTransactions={
                wallets[selectedId] && wallets[selectedId]?.transactions
              }
            />
          </div>

          <title>Transactions</title>
          <div className={homeStyles.tableContainer}> 
            {wallets && wallets[selectedId] && (
              <TableTransaction
                dataTransactions={wallets[selectedId].transactions}
              />
            )} 
          </div> 

        </div>
      </main>
    </>
  );
}

Wallet.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};