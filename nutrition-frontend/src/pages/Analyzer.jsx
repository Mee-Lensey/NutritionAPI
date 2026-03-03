import { useState } from "react";

function round(n, digits = 1) {
  if (typeof n !== "number") return "—";
  const p = Math.pow(10, digits);
  return Math.round(n * p) / p;
}

function sumFromIngredients(data, code) {
  const ings = data?.ingredients || [];
  let total = 0;
  let found = false;

  for (const ing of ings) {
    const parsedList = ing?.parsed || [];
    for (const p of parsedList) {
      const n = p?.nutrients?.[code]?.quantity;
      if (typeof n === "number") {
        total += n;
        found = true;
      }
    }
  }
  return found ? total : null;
}

function getTotal(data, code) {
  // Prefer top-level totals if present
  const top = data?.totalNutrients?.[code]?.quantity;
  if (typeof top === "number") return top;

  // Fallback: sum ingredient-level nutrients
  return sumFromIngredients(data, code);
}

export default function Analyzer() {
  const [title, setTitle] = useState("rice and peas");
  const [ingredientsText, setIngredientsText] = useState(
    "1 cup rice\n10 oz chickpeas",
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [etag, setEtag] = useState("");
  const [data, setData] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setData(null);
    setEtag("");

    const ingr = ingredientsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!title.trim() || ingr.length === 0) {
      setError("Add a title and at least one ingredient line.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/analyze-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), ingr }),
      });

      const resEtag = res.headers.get("etag");
      if (resEtag) setEtag(resEtag);

      const contentType = res.headers.get("content-type") || "";
      const bodyText = await res.text();

      let parsed;
      if (contentType.includes("application/json")) {
        parsed = JSON.parse(bodyText);
      } else {
        throw new Error(bodyText || `Server returned ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(parsed?.error || JSON.stringify(parsed));
      }

      setData(parsed);
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  // Macros + calories
  const calories =
    typeof data?.calories === "number"
      ? data.calories
      : getTotal(data, "ENERC_KCAL");
  const protein = getTotal(data, "PROCNT");
  const carbs = getTotal(data, "CHOCDF");
  const fat = getTotal(data, "FAT");
  const fiber = getTotal(data, "FIBTG");
  const sugar = getTotal(data, "SUGAR");

  // Minerals
  const calcium = getTotal(data, "CA");
  const iron = getTotal(data, "FE");
  const magnesium = getTotal(data, "MG");
  const potassium = getTotal(data, "K");
  const sodium = getTotal(data, "NA");
  const zinc = getTotal(data, "ZN");
  const phosphorus = getTotal(data, "P");

  // Vitamins
  const vitA = getTotal(data, "VITA_RAE");
  const vitC = getTotal(data, "VITC");
  const vitD = getTotal(data, "VITD");
  const vitE = getTotal(data, "TOCPHA");
  const vitK = getTotal(data, "VITK1");
  const vitB6 = getTotal(data, "VITB6A");
  const vitB12 = getTotal(data, "VITB12");
  const thiamin = getTotal(data, "THIA");
  const riboflavin = getTotal(data, "RIBF");
  const niacin = getTotal(data, "NIA");
  const folate = getTotal(data, "FOLDFE");

  return (
    <section className="card">
      <h1>Nutrition Analyzer</h1>
      <p className="sub">
        One ingredient per line (no trailing commas). Example:{" "}
        <code>2 tbsp peanut butter</code>
      </p>

      <form className="cardInner" onSubmit={onSubmit}>
        <label>
          Recipe title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          Ingredients
          <textarea
            rows={8}
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
          />
        </label>

        <button disabled={loading} type="submit">
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {error ? <div className="status error">Error: {error}</div> : null}
      </form>

      {data ? (
        <>
          <h2>Results</h2>

          <div className="grid">
            <div className="stat">
              <div className="k">Calories</div>
              <div className="v">
                {calories !== null ? round(calories, 0) : "—"}
              </div>
            </div>
            <div className="stat">
              <div className="k">Yield</div>
              <div className="v">{data.yield ?? "—"}</div>
            </div>
            <div className="stat">
              <div className="k">Total Weight (g)</div>
              <div className="v">
                {typeof data.totalWeight === "number"
                  ? round(data.totalWeight, 0)
                  : "—"}
              </div>
            </div>
          </div>

          <h3>Macros (total)</h3>
          <div className="grid">
            <div className="stat">
              <div className="k">Protein (g)</div>
              <div className="v">
                {protein !== null ? round(protein, 1) : "—"}
              </div>
            </div>
            <div className="stat">
              <div className="k">Carbs (g)</div>
              <div className="v">{carbs !== null ? round(carbs, 1) : "—"}</div>
            </div>
            <div className="stat">
              <div className="k">Fat (g)</div>
              <div className="v">{fat !== null ? round(fat, 1) : "—"}</div>
            </div>
            <div className="stat">
              <div className="k">Fiber (g)</div>
              <div className="v">{fiber !== null ? round(fiber, 1) : "—"}</div>
            </div>
            <div className="stat">
              <div className="k">Sugar (g)</div>
              <div className="v">{sugar !== null ? round(sugar, 1) : "—"}</div>
            </div>
          </div>

          <h3>Minerals (total)</h3>
          <div className="grid">
            <div className="stat">
              <div className="k">Calcium (mg)</div>
              <div className="v">
                {calcium !== null ? round(calcium, 1) : "—"}
              </div>
            </div>
            <div className="stat">
              <div className="k">Iron (mg)</div>
              <div className="v">{iron !== null ? round(iron, 1) : "—"}</div>
            </div>
            <div className="stat">
              <div className="k">Magnesium (mg)</div>
              <div className="v">
                {magnesium !== null ? round(magnesium, 1) : "—"}
              </div>
            </div>
            <div className="stat">
              <div className="k">Potassium (mg)</div>
              <div className="v">
                {potassium !== null ? round(potassium, 1) : "—"}
              </div>
            </div>
            <div className="stat">
              <div className="k">Sodium (mg)</div>
              <div className="v">
                {sodium !== null ? round(sodium, 1) : "—"}
              </div>
            </div>
            <div className="stat">
              <div className="k">Zinc (mg)</div>
              <div className="v">{zinc !== null ? round(zinc, 2) : "—"}</div>
            </div>
            <div className="stat">
              <div className="k">Phosphorus (mg)</div>
              <div className="v">
                {phosphorus !== null ? round(phosphorus, 1) : "—"}
              </div>
            </div>
          </div>

          <h3>Vitamins (total)</h3>
          <div className="grid">
            <div className="stat">
              <div className="k">Vitamin A (µg)</div>
              <div className="v">{vitA !== null ? round(vitA, 1) : "—"}</div>
            </div>
            <div className="stat">
              <div className="k">Vitamin C (mg)</div>
              <div className="v">{vitC !== null ? round(vitC, 1) : "—"}</div>
            </div>
            <div className="stat">
              <div className="k">Vitamin D (µg)</div>
              <div className="v">{vitD !== null ? round(vitD, 2) : "—"}</div>
            </div>
            <div className="stat">
              <div className="k">Vitamin E (mg)</div>
              <div className="v">{vitE !== null ? round(vitE, 2) : "—"}</div>
            </div>
            <div className="stat">
              <div className="k">Vitamin K (µg)</div>
              <div className="v">{vitK !== null ? round(vitK, 1) : "—"}</div>
            </div>

            <div className="stat">
              <div className="k">Vitamin B6 (mg)</div>
              <div className="v">{vitB6 !== null ? round(vitB6, 2) : "—"}</div>
            </div>
            <div className="stat">
              <div className="k">Vitamin B12 (µg)</div>
              <div className="v">
                {vitB12 !== null ? round(vitB12, 2) : "—"}
              </div>
            </div>
            <div className="stat">
              <div className="k">Thiamin B1 (mg)</div>
              <div className="v">
                {thiamin !== null ? round(thiamin, 2) : "—"}
              </div>
            </div>
            <div className="stat">
              <div className="k">Riboflavin B2 (mg)</div>
              <div className="v">
                {riboflavin !== null ? round(riboflavin, 2) : "—"}
              </div>
            </div>
            <div className="stat">
              <div className="k">Niacin B3 (mg)</div>
              <div className="v">
                {niacin !== null ? round(niacin, 2) : "—"}
              </div>
            </div>
            <div className="stat">
              <div className="k">Folate (µg)</div>
              <div className="v">
                {folate !== null ? round(folate, 1) : "—"}
              </div>
            </div>
          </div>

          <details className="details">
            <summary>Advanced</summary>
            <div className="mono">
              <div>
                <b>ETag:</b> {etag || "—"}
              </div>
              <div>
                <b>URI:</b> {data.uri || "—"}
              </div>
            </div>
            <pre className="raw">{JSON.stringify(data, null, 2)}</pre>
          </details>
        </>
      ) : null}
    </section>
  );
}
