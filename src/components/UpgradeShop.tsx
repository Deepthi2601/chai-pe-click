import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ShoppingBag } from 'lucide-react';
import { UpgradeId, UpgradeLevels } from '../game/types';
import { UPGRADES_CATALOG, getUpgradeCost } from '../game/constants';

interface UpgradeShopProps {
  coins: number;
  upgrades: UpgradeLevels;
  onPurchase: (id: UpgradeId) => void;
  onBack: () => void;
}

export const UpgradeShop: React.FC<UpgradeShopProps> = ({
  coins,
  upgrades,
  onPurchase,
  onBack,
}) => {
  const [recentPurchasedId, setRecentPurchasedId] = useState<UpgradeId | null>(null);

  const handleBuy = (id: UpgradeId) => {
    onPurchase(id);
    setRecentPurchasedId(id);
    setTimeout(() => setRecentPurchasedId(null), 1100);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1D3328] border border-amber-500/25 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
            <ShoppingBag className="w-4 h-4" />
            <span>Irani Café Equipment & Ingredients</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-50 mt-1">Café Upgrade Shop</h1>
          <p className="text-sm text-amber-100/80 mt-1">
            Spend the Osmaniye Coins you earn in each round to permanently boost your café skills.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2.5 rounded-xl bg-[#12221A] border border-amber-400/35 text-right">
            <div className="text-[11px] text-amber-200/75">Available Balance</div>
            <div className="text-xl font-bold text-amber-300 font-mono-tabular">
              🪙 {coins.toLocaleString()} Coins
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13241B] hover:bg-amber-900/30 text-amber-100 border border-amber-500/30 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Upgrades Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        {UPGRADES_CATALOG.map((up) => {
          const currentLevel = upgrades[up.id] || 0;
          const isMaxed = currentLevel >= up.maxLevel;
          const cost = getUpgradeCost(up.baseCost, up.costMultiplier, currentLevel);
          const canAfford = coins >= cost && !isMaxed;
          const justBought = recentPurchasedId === up.id;

          return (
            <div
              key={up.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-[#1D3328] border border-amber-500/25 space-y-5"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-amber-300/90">
                  <span>
                    {up.hindiSub} · {up.modeTag}
                  </span>
                  <span className="font-mono-tabular font-semibold text-amber-200">
                    Level {currentLevel} / {up.maxLevel}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-amber-50">{up.name}</h2>

                <p className="text-sm text-amber-100/80 leading-relaxed">{up.description}</p>

                <div className="pt-1 text-xs font-medium text-amber-300">
                  {up.effectSummary(currentLevel)}
                </div>

                {/* Level Progress Bar */}
                <div className="w-full h-2 rounded-full bg-[#12221A] overflow-hidden border border-amber-500/20">
                  <div
                    className="h-full bg-amber-400 transition-all duration-200"
                    style={{ width: `${(currentLevel / up.maxLevel) * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] text-amber-200/70">Upgrade Cost</div>
                  <div className="text-base font-bold text-amber-200 font-mono-tabular">
                    {isMaxed ? 'MAX LEVEL' : `🪙 ${cost} Coins`}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!canAfford || isMaxed}
                  onClick={() => handleBuy(up.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap shrink-0 ${
                    isMaxed
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 cursor-default'
                      : canAfford
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md cursor-pointer'
                      : 'bg-[#12221A] text-amber-100/40 border border-amber-500/15 cursor-not-allowed'
                  }`}
                >
                  {justBought ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Upgraded!</span>
                    </>
                  ) : isMaxed ? (
                    <span>Mastered</span>
                  ) : (
                    <span>Buy Upgrade</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
