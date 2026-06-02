"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  Package,
  RefreshCw,
  Search,
  Wrench,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { adminInventoryApi } from "@/lib/api";

type InventoryProduct = {
  id: number;
  title?: string | null;
  sku?: string | null;
  status?: string | null;
};

type InventoryVariant = {
  id: number;
  title?: string | null;
  sku?: string | null;
  status?: string | null;
};

type InventoryRecord = {
  id: number;
  productId?: number | null;
  variantId?: number | null;
  quantity?: number | null;
  availableQuantity?: number | null;
  reservedQuantity?: number | null;
  effectiveQuantity?: number | null;
  lowStockThreshold?: number | null;
  allowBackorder?: boolean;
  isLowStock?: boolean;
  product?: InventoryProduct | null;
  variant?: InventoryVariant | null;
  updatedAt?: string | null;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null) {
    return fallback;
  }

  const maybeError = error as {
    message?: string;
    response?: {
      data?: {
        message?: string;
      };
    };
  };

  return maybeError.response?.data?.message || maybeError.message || fallback;
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const resolveAvailableQuantity = (item: InventoryRecord) => {
  const available = toNumber(item.availableQuantity, NaN);
  if (Number.isFinite(available)) {
    return available;
  }

  return toNumber(item.quantity, 0);
};

const resolveReservedQuantity = (item: InventoryRecord) => {
  return Math.max(toNumber(item.reservedQuantity, 0), 0);
};

const resolveEffectiveQuantity = (item: InventoryRecord) => {
  const explicit = toNumber(item.effectiveQuantity, NaN);
  if (Number.isFinite(explicit)) {
    return Math.max(explicit, 0);
  }

  const fallback = resolveAvailableQuantity(item) - resolveReservedQuantity(item);
  return Math.max(fallback, 0);
};

const resolveThreshold = (item: InventoryRecord) => {
  const value = toNumber(item.lowStockThreshold, NaN);
  return Number.isFinite(value) && value >= 0 ? value : null;
};

const resolveDisplayName = (item: InventoryRecord) => {
  const productTitle = item.product?.title?.trim() || "Untitled Product";
  const variantTitle = item.variant?.title?.trim();

  if (variantTitle) {
    return `${productTitle} - ${variantTitle}`;
  }

  return productTitle;
};

const resolveSku = (item: InventoryRecord) => {
  const variantSku = item.variant?.sku?.trim();
  if (variantSku) {
    return variantSku;
  }

  const productSku = item.product?.sku?.trim();
  if (productSku) {
    return productSku;
  }

  return "-";
};

const resolveStatus = (item: InventoryRecord) => {
  const effective = resolveEffectiveQuantity(item);
  const threshold = resolveThreshold(item);
  const allowBackorder = Boolean(item.allowBackorder);

  if (allowBackorder && effective <= 0) {
    return {
      label: "Backorder",
      badgeClass: "bg-blue-100 text-blue-700",
      Icon: Wrench,
      barClass: "bg-blue-500",
    };
  }

  if (effective <= 0) {
    return {
      label: "Out of Stock",
      badgeClass: "bg-red-100 text-red-700",
      Icon: XCircle,
      barClass: "bg-red-500",
    };
  }

  if (threshold !== null && effective <= threshold) {
    return {
      label: "Low Stock",
      badgeClass: "bg-orange-100 text-orange-700",
      Icon: AlertTriangle,
      barClass: "bg-amber-500",
    };
  }

  return {
    label: "In Stock",
    badgeClass: "bg-green-100 text-green-700",
    Icon: CheckCircle,
    barClass: "bg-green-500",
  };
};

const resolveUpdatedAt = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminInventory() {
  const [items, setItems] = useState<InventoryRecord[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [pendingActionKey, setPendingActionKey] = useState("");

  const loadInventory = useCallback(async ({ showLoader = true }: { showLoader?: boolean } = {}) => {
    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      setError("");

      const [listResponse, lowStockResponse] = await Promise.all([
        adminInventoryApi.list({
          page: 1,
          limit: 100, // Backend max limit is 100
          sortBy: "updatedAt",
          sortOrder: "DESC",
        }),
        adminInventoryApi.lowStock({ limit: 100 }),
      ]);

      const listItems = (listResponse.data?.data?.items || []) as InventoryRecord[];
      const lowItems = (lowStockResponse.data?.data || []) as InventoryRecord[];

      setItems(listItems);
      setLowStockItems(lowItems);
    } catch (requestError: unknown) {
      setItems([]);
      setLowStockItems([]);
      setError(getErrorMessage(requestError, "Failed to load inventory"));
    } finally {
      if (showLoader) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const displayName = resolveDisplayName(item).toLowerCase();
      const sku = resolveSku(item).toLowerCase();
      const productId = String(item.productId || "");
      const variantId = String(item.variantId || "");
      const threshold = resolveThreshold(item);
      const effective = resolveEffectiveQuantity(item);
      const lowStockMatch = threshold !== null ? effective <= threshold : Boolean(item.isLowStock);

      const matchesSearch =
        !normalizedSearch
        || displayName.includes(normalizedSearch)
        || sku.includes(normalizedSearch)
        || productId.includes(normalizedSearch)
        || variantId.includes(normalizedSearch);

      const matchesLowStock = !filterLowStock || lowStockMatch;

      return matchesSearch && matchesLowStock;
    });
  }, [filterLowStock, items, searchQuery]);

  const summary = useMemo(() => {
    const totalReserved = items.reduce((sum, item) => sum + resolveReservedQuantity(item), 0);
    const outOfStockCount = items.filter((item) => {
      const status = resolveStatus(item);
      return status.label === "Out of Stock";
    }).length;

    return {
      totalItems: items.length,
      lowStockCount: lowStockItems.length,
      outOfStockCount,
      totalReserved,
    };
  }, [items, lowStockItems.length]);

  const performAction = async (
    actionKey: string,
    action: () => Promise<unknown>,
    successMessage: string,
    errorFallback: string,
  ) => {
    setPendingActionKey(actionKey);

    try {
      await action();
      await loadInventory({ showLoader: false });
      toast.success(successMessage);
    } catch (requestError: unknown) {
      toast.error(getErrorMessage(requestError, errorFallback));
    } finally {
      setPendingActionKey("");
    }
  };

  const handleRestock = async (item: InventoryRecord, quantity: number) => {
    await performAction(
      `${item.id}:restock:${quantity}`,
      () => adminInventoryApi.restock(item.id, {
        quantity,
        reason: `Quick restock +${quantity}`,
      }),
      `Added ${quantity} units`,
      "Failed to restock inventory",
    );
  };

  const handleDamaged = async (item: InventoryRecord, quantity: number) => {
    await performAction(
      `${item.id}:damaged:${quantity}`,
      () => adminInventoryApi.damaged(item.id, {
        quantity,
        reason: `Damaged stock -${quantity}`,
      }),
      `Deducted ${quantity} damaged units`,
      "Failed to mark damaged stock",
    );
  };

  const handleCustomAdjustment = async (item: InventoryRecord) => {
    const raw = window.prompt(
      `Adjust stock for ${resolveDisplayName(item)}. Enter a non-zero integer (+/-).`,
      "10",
    );

    if (raw === null) {
      return;
    }

    const quantityDelta = Number.parseInt(raw.trim(), 10);

    if (!Number.isInteger(quantityDelta) || quantityDelta === 0) {
      toast.error("Enter a valid non-zero integer");
      return;
    }

    await performAction(
      `${item.id}:adjust:${quantityDelta}`,
      () => adminInventoryApi.adjust(item.id, {
        quantityDelta,
        reason: quantityDelta > 0 ? "Manual stock increase" : "Manual stock decrease",
      }),
      "Inventory adjusted successfully",
      "Failed to adjust inventory",
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">Inventory & Stock</h2>
          <p className="text-gray-500 font-medium text-sm">
            Live warehouse stock, reservation-aware sellable quantity, and quick adjustments.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setFilterLowStock((prev) => !prev)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all cursor-pointer ${
              filterLowStock
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <AlertTriangle size={16} />
            {filterLowStock ? "Showing Low Stock" : "Filter Low Stock"}
          </button>

          <button
            onClick={() => {
              void loadInventory({ showLoader: false });
            }}
            disabled={refreshing}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all cursor-pointer bg-[#facc15] text-black hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {refreshing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Records</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{summary.totalItems}</p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Low Stock Alerts</p>
          <p className="text-3xl font-black text-amber-600 mt-2">{summary.lowStockCount}</p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Out of Stock</p>
          <p className="text-3xl font-black text-red-600 mt-2">{summary.outOfStockCount}</p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reserved Units</p>
          <p className="text-3xl font-black text-blue-600 mt-2">{summary.totalReserved}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by product name, SKU, product ID, or variant ID..."
            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#facc15] outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-4xl border border-gray-100 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center gap-3 text-gray-500 font-bold text-sm uppercase tracking-widest">
            <Loader2 size={18} className="animate-spin" /> Loading inventory...
          </div>
        ) : error ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-bold text-red-600">{error}</p>
            <button
              onClick={() => {
                void loadInventory();
              }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-[#facc15] text-black hover:bg-yellow-500 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-sm font-bold text-gray-500">No inventory records matched your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">Product</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">SKU</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">Available</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">Reserved</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">Sellable</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">Threshold</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">Updated</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => {
                  const available = resolveAvailableQuantity(item);
                  const reserved = resolveReservedQuantity(item);
                  const effective = resolveEffectiveQuantity(item);
                  const threshold = resolveThreshold(item);
                  const status = resolveStatus(item);
                  const pendingForRow = pendingActionKey.startsWith(`${item.id}:`);
                  const stockVisualBase = Math.max((threshold || 10) * 3, 1);
                  const stockBarWidth = Math.min(100, (effective / stockVisualBase) * 100);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-100 shrink-0 flex items-center justify-center">
                            <Package className="text-gray-400" size={20} />
                          </div>
                          <div>
                            <span className="font-black text-gray-900 uppercase tracking-tight block">
                              {resolveDisplayName(item)}
                            </span>
                            <span className="text-xs font-bold text-gray-400">
                              Inventory #{item.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 font-mono text-sm font-bold text-gray-700">{resolveSku(item)}</td>

                      <td className="px-6 py-5">
                        <span className="text-sm font-black text-gray-800">{available}</span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm font-black text-blue-700">{reserved}</span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="space-y-1 min-w-28">
                          <div className="flex justify-between text-xs font-bold text-gray-700">
                            <span>{effective} units</span>
                            <span className="text-gray-400">T: {threshold ?? "-"}</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all rounded-full ${status.barClass}`}
                              style={{ width: `${stockBarWidth}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-gray-600">{threshold ?? "-"}</span>
                      </td>

                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${status.badgeClass}`}>
                          <status.Icon size={12} />
                          {status.label}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-gray-500">{resolveUpdatedAt(item.updatedAt)}</span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              void handleRestock(item, 25);
                            }}
                            disabled={pendingForRow}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#facc15] hover:bg-yellow-500 text-black font-black text-xs rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed\"
                            title="Add 25 units"
                          >
                            {pendingActionKey === `${item.id}:restock:25` ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <RefreshCw size={12} />
                            )}
                            +25
                          </button>

                          <button
                            onClick={() => {
                              void handleRestock(item, 50);
                            }}
                            disabled={pendingForRow}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#facc15] hover:bg-yellow-500 text-black font-black text-xs rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            title="Add 50 units"
                          >
                            {pendingActionKey === `${item.id}:restock:50` ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <RefreshCw size={12} />
                            )}
                            +50
                          </button>

                          <button
                            onClick={() => {
                              void handleDamaged(item, 5);
                            }}
                            disabled={pendingForRow}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 font-black text-xs rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            title="Deduct 5 damaged units"
                          >
                            {pendingActionKey === `${item.id}:damaged:5` ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <XCircle size={12} />
                            )}
                            -5
                          </button>

                          <button
                            onClick={() => {
                              void handleCustomAdjustment(item);
                            }}
                            disabled={pendingForRow}
                            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 font-black text-xs rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            title="Manual + / - adjustment"
                          >
                            {pendingActionKey.startsWith(`${item.id}:adjust:`) ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Wrench size={12} />
                            )}
                            Adjust
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
