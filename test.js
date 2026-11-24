function runStockPulseTests(targetModule, sampleData) {
  const {
    formatProductsForDisplay,
    filterLowStockProducts,
    calculateTotalStock,
    calculateTotalValue,
    searchProducts,
    sortProducts
  } = targetModule;

  const results = [];

  function assert(title, category, condition, expected, actual) {
    results.push({
      title,
      category,
      passed: Boolean(condition),
      expected: JSON.stringify(expected),
      actual: JSON.stringify(actual)
    });
  }

  const category1 = "基本課題 1: formatProductsForDisplay (map)";
  try {
    const output = formatProductsForDisplay(sampleData);

    assert(
      "返される配列の要素数が引数と同じ（10件）であること",
      category1,
      Array.isArray(output) && output.length === 10,
      10,
      output ? output.length : null
    );

    const first = output && output[0];
    const hasProps = first &&
      "totalValue" in first &&
      "isLowStock" in first &&
      "statusText" in first &&
      "shortage" in first;
    assert(
      "各商品に totalValue, isLowStock, statusText, shortage プロパティが存在すること",
      category1,
      hasProps,
      "4つのプロパティ全てが存在",
      first ? Object.keys(first) : null
    );

    assert(
      "在庫評価額 (totalValue = price * stock) が正しく計算されていること (id:1)",
      category1,
      first && first.totalValue === 48000,
      48000,
      first ? first.totalValue : null
    );

    const item2 = output && output.find(p => p.id === 2);
    assert(
      "境界値: stock == safetyStock のとき isLowStock が true、statusText が '要補充' であること (id:2)",
      category1,
      item2 && item2.isLowStock === true && item2.statusText === "要補充",
      { isLowStock: true, statusText: "要補充" },
      item2 ? { isLowStock: item2.isLowStock, statusText: item2.statusText } : null
    );

    const item4 = output && output.find(p => p.id === 4);
    assert(
      "境界値: stock == 0 のとき statusText が '在庫切れ'、totalValue が 0 であること (id:4)",
      category1,
      item4 && item4.statusText === "在庫切れ" && item4.totalValue === 0 && item4.isLowStock === true,
      { statusText: "在庫切れ", totalValue: 0, isLowStock: true },
      item4 ? { statusText: item4.statusText, totalValue: item4.totalValue, isLowStock: item4.isLowStock } : null
    );

    const item3 = output && output.find(p => p.id === 3);
    assert(
      "不足数 (shortage = safetyStock - stock) が正しく算出されていること (id:3)",
      category1,
      item3 && item3.shortage === 2,
      2,
      item3 ? item3.shortage : null
    );

    assert(
      "在庫十分な商品の statusText が '適正'、shortage が 0 であること (id:1)",
      category1,
      first && first.statusText === "適正" && first.shortage === 0,
      { statusText: "適正", shortage: 0 },
      first ? { statusText: first.statusText, shortage: first.shortage } : null
    );

    const emptyOutput = formatProductsForDisplay([]);
    assert(
      "空配列 [] を渡したとき、エラーにならず空配列 [] が返ること",
      category1,
      Array.isArray(emptyOutput) && emptyOutput.length === 0,
      [],
      emptyOutput
    );

  } catch (err) {
    assert("実行時例外が発生しました", category1, false, "例外なし", err.message);
  }


  const category2 = "基本課題 2: filterLowStockProducts (filter)";
  try {
    const lowStockList = filterLowStockProducts(sampleData);

    assert(
      "要補充商品（stock <= safetyStock）の抽出件数が 6 件であること",
      category2,
      Array.isArray(lowStockList) && lowStockList.length === 6,
      6,
      lowStockList ? lowStockList.length : null
    );

    const ids = lowStockList ? lowStockList.map(p => p.id) : [];
    const containsEdgeCases = ids.includes(2) && ids.includes(4) && ids.includes(6);
    assert(
      "境界値の商品 (id:2 同数, id:4 在库0, id:6 同数) が抽出結果に含まれていること",
      category2,
      containsEdgeCases,
      "id: 2, 4, 6 をすべて含む",
      ids
    );

    const containsAdequate = ids.includes(1) || ids.includes(5) || ids.includes(7) || ids.includes(9);
    assert(
      "在庫十分な商品 (id: 1, 5, 7, 9) が抽出結果に含まれていないこと",
      category2,
      !containsAdequate,
      "在庫十分な商品は含まれない",
      containsAdequate ? "含まれてしまっています" : "正常に除外"
    );

    const adequateOnly = [
      { id: 99, name: "テスト品", price: 1000, stock: 50, safetyStock: 10 }
    ];
    const adequateResult = filterLowStockProducts(adequateOnly);
    assert(
      "すべて適正在庫の配列を渡したとき、空配列 [] が返ること",
      category2,
      Array.isArray(adequateResult) && adequateResult.length === 0,
      [],
      adequateResult
    );

    const emptyResult = filterLowStockProducts([]);
    assert(
      "空配列 [] を渡したとき、エラーにならず空配列 [] が返ること",
      category2,
      Array.isArray(emptyResult) && emptyResult.length === 0,
      [],
      emptyResult
    );

  } catch (err) {
    assert("実行時例外が発生しました", category2, false, "例外なし", err.message);
  }


  const category3 = "基本課題 3: calculateTotalStock (reduce)";
  try {
    const total = calculateTotalStock(sampleData);

    assert(
      "サンプルデータ全10商品の総在庫数が 99点 であること",
      category3,
      total === 99,
      99,
      total
    );

    const customList = [{ stock: 10 }, { stock: 25 }, { stock: 0 }];
    const customTotal = calculateTotalStock(customList);
    assert(
      "在庫数 10 + 25 + 0 の合計が 35 となること",
      category3,
      customTotal === 35,
      35,
      customTotal
    );

    const emptyTotal = calculateTotalStock([]);
    assert(
      "空配列 [] を渡したとき、0 が返ること (初期値 0 の指定)",
      category3,
      emptyTotal === 0,
      0,
      emptyTotal
    );

  } catch (err) {
    assert("実行時例外が発生しました", category3, false, "例外なし", err.message);
  }


  const category4 = "基本課題 4: calculateTotalValue (reduce)";
  try {
    const totalVal = calculateTotalValue(sampleData);

    assert(
      "サンプルデータ全10商品の在庫総評価額が 852,560円 であること",
      category4,
      totalVal === 852560,
      852560,
      totalVal
    );

    const customValueList = [
      { price: 1000, stock: 3 },
      { price: 2500, stock: 2 },
      { price: 8000, stock: 0 }
    ];
    const customTotalVal = calculateTotalValue(customValueList);
    assert(
      "単価×個数の累積合計 (3000 + 5000 + 0 = 8000円) が正しく計算されること",
      category4,
      customTotalVal === 8000,
      8000,
      customTotalVal
    );

    const emptyTotalVal = calculateTotalValue([]);
    assert(
      "空配列 [] を渡したとき、0 が返ること",
      category4,
      emptyTotalVal === 0,
      0,
      emptyTotalVal
    );

  } catch (err) {
    assert("実行時例外が発生しました", category4, false, "例外なし", err.message);
  }


  const category5 = "発展課題 (任意・挑戦枠)";
  try {
    if (typeof searchProducts === "function") {
      const searchRes = searchProducts(sampleData, "モニター");
      const isImplemented = searchRes && searchRes.length === 1 && searchRes[0].id === 3;
      assert(
        "【発展 1】searchProducts: 'モニター' で検索すると該当1件が抽出されること",
        category5,
        isImplemented,
        1,
        searchRes ? searchRes.length : 0
      );
    }

    if (typeof sortProducts === "function") {
      const sortedByPriceAsc = sortProducts(sampleData, "price", "asc");
      const isImplemented = sortedByPriceAsc &&
        sortedByPriceAsc[0].price === 680 &&
        sortedByPriceAsc[sortedByPriceAsc.length - 1].price === 48000;
      assert(
        "【発展 2】sortProducts: 価格昇順で最小680円から最大48000円に並び替わること",
        category5,
        isImplemented,
        "最小: 680円, 最大: 48000円",
        sortedByPriceAsc ? `最小: ${sortedByPriceAsc[0]?.price}円, 最大: ${sortedByPriceAsc[sortedByPriceAsc.length - 1]?.price}円` : null
      );
    }
  } catch (err) {
    assert("発展課題で例外が発生しました", category5, false, "正常終了", err.message);
  }

  return results;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { runStockPulseTests };
}
