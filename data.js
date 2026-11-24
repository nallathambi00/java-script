const PRODUCTS = [
  {
    id: 1,
    name: "ワイヤレス静音マウス M20",
    category: "PC周辺機器",
    price: 3200,
    stock: 15,
    safetyStock: 10
  },
  {
    id: 2,
    name: "メカニカルキーボード (赤軸)",
    category: "PC周辺機器",
    price: 12800,
    stock: 5,
    safetyStock: 5
  },
  {
    id: 3,
    name: "27インチ 4Kモニター UHD-27",
    category: "ディスプレイ",
    price: 42000,
    stock: 2,
    safetyStock: 4
  },
  {
    id: 4,
    name: "USB-C ハブ 7-in-1 スリム",
    category: "PC周辺機器",
    price: 4500,
    stock: 0,
    safetyStock: 8
  },
  {
    id: 5,
    name: "エルゴノミクスオフィスチェア",
    category: "オフィス家具",
    price: 34800,
    stock: 8,
    safetyStock: 5
  },
  {
    id: 6,
    name: "昇降式スタンディングデスク",
    category: "オフィス家具",
    price: 48000,
    stock: 3,
    safetyStock: 3
  },
  {
    id: 7,
    name: "デスク用LEDスクリーンバー",
    category: "照明",
    price: 5800,
    stock: 20,
    safetyStock: 10
  },
  {
    id: 8,
    name: "ノイズキャンセリングヘッドセット",
    category: "オーディオ",
    price: 18500,
    stock: 4,
    safetyStock: 6
  },
  {
    id: 9,
    name: "ケーブル結束スリーブ (2m)",
    category: "サプライ",
    price: 1200,
    stock: 30,
    safetyStock: 15
  },
  {
    id: 10,
    name: "マイクロファイバー画面クロス",
    category: "サプライ",
    price: 680,
    stock: 12,
    safetyStock: 20
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PRODUCTS };
}
