import { ChartSpec } from "@/types/chart";

export function generateSeabornCode(spec: ChartSpec): string {
  const chartType = spec.chart_type;

  let plotCode = "";
  if (chartType === "bar") {
    const aggComment = spec.aggregation !== "none" ? ` # Aggregation: ${spec.aggregation.toUpperCase()}` : "";
    const hueArg = spec.hue_column ? `, hue="${spec.hue_column}"` : "";
    plotCode = `sns.barplot(data=df, x="${spec.x_column}", y="${spec.y_column || spec.x_column}"${hueArg}, palette="${spec.theme}", ax=ax)${aggComment}`;
  } else if (chartType === "line") {
    const hueArg = spec.hue_column ? `, hue="${spec.hue_column}"` : "";
    plotCode = `sns.lineplot(data=df, x="${spec.x_column}", y="${spec.y_column}"${hueArg}, marker="o", linewidth=2.5, palette="${spec.theme}", ax=ax)`;
  } else if (chartType === "scatter") {
    const hueArg = spec.hue_column ? `, hue="${spec.hue_column}"` : "";
    plotCode = `sns.scatterplot(data=df, x="${spec.x_column}", y="${spec.y_column}"${hueArg}, s=60, palette="${spec.theme}", ax=ax)`;
  } else if (chartType === "histogram") {
    const hueArg = spec.hue_column ? `, hue="${spec.hue_column}"` : "";
    plotCode = `sns.histplot(data=df, x="${spec.x_column}"${hueArg}, kde=True, palette="${spec.theme}", ax=ax)`;
  } else if (chartType === "box") {
    const hueArg = spec.hue_column ? `, hue="${spec.hue_column}"` : "";
    const yArg = spec.y_column ? `, y="${spec.y_column}"` : "";
    plotCode = `sns.boxplot(data=df, x="${spec.x_column}"${yArg}${hueArg}, palette="${spec.theme}", ax=ax)`;
  } else if (chartType === "pie") {
    plotCode = `# Pie Chart rendering
counts = df["${spec.x_column}"].value_counts()
ax.pie(counts, labels=counts.index, autopct="%1.1f%%", startangle=140)`;
  } else if (chartType === "heatmap") {
    plotCode = `# Compute numerical correlation matrix
numeric_df = df.select_dtypes(include=['float64', 'int64'])
corr = numeric_df.corr()
sns.heatmap(corr, annot=True, cmap="${spec.theme}", fmt=".2f", ax=ax)`;
  } else {
    plotCode = `sns.scatterplot(data=df, x="${spec.x_column}", y="${spec.y_column}", ax=ax)`;
  }

  const isDark = spec.grid_style === "darkgrid" || spec.grid_style === "dark";
  const bgHex = isDark ? (spec.grid_style === "dark" ? "#09090B" : "#18181B") : "#FFFFFF";

  return `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# 1. Load dataset (Replace 'dataset.csv' with your actual file path)
df = pd.read_csv("dataset.csv")

# 2. Configure Seaborn theme & aesthetics
sns.set_theme(
    style="${spec.grid_style}",
    rc={
        "axes.facecolor": "${bgHex}",
        "figure.facecolor": "${bgHex}",
        "axes.grid": ${spec.show_grid ? "True" : "False"},
        "grid.linestyle": "--",
        "grid.alpha": 0.7,
    }
)

# 3. Initialize figure canvas
fig, ax = plt.subplots(figsize=(${spec.fig_width}, ${spec.fig_height}), facecolor="${bgHex}")

# 4. Generate ${spec.chart_type.toUpperCase()} plot
${plotCode}

# 5. Titles & labels
ax.set_title("${spec.title}", fontsize=14, fontweight="bold", pad=15)
ax.set_xlabel("${spec.x_label}", fontsize=11, fontweight="semibold")
${spec.chart_type !== "pie" && spec.chart_type !== "heatmap" ? `ax.set_ylabel("${spec.y_label}", fontsize=11, fontweight="semibold")` : ""}

plt.tight_layout()

# 6. Save image or display
plt.savefig("${spec.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.png", dpi=300, bbox_inches="tight")
plt.show()
`;
}
