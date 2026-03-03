import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="card">
      <h1>Welcome to my Nutrition Page</h1>
      <p className="sub">
        Use this site to estimate calories and macros from ingredient lists.
        It’s quick, simple, and helps you make better choices.
      </p>

      <h2>Quick nutrition facts</h2>
      <ul className="bullets">
        <li><b>Calories</b> = energy. If you eat more than you burn, weight goes up over time.</li>
        <li><b>Protein</b> helps build/repair muscle and usually keeps you full longer.</li>
        <li><b>Carbs</b> are fast energy. Whole grains + fruit are better than sugary snacks.</li>
        <li><b>Fat</b> supports hormones and brain health. Unsaturated fats are the best choice.</li>
        <li><b>Fiber</b> helps digestion and blood sugar control. Plants = your best source.</li>
        <li><b>Sodium</b> is salt. Processed foods are usually the main source.</li>
      </ul>

      <div className="actions">
        <Link className="btn" to="/analyze">Go to Analyzer</Link>
      </div>
    </section>
  );
}
